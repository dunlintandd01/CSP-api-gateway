import { Injectable, Logger } from '@nestjs/common'
import { Redis } from 'ioredis'
import * as RedLock from 'redlock'
import { Repository, MoreThan } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as R from 'ramda'

import { InjectRedis, InjectRedLock } from '../../core/redis'
import { STOCK_TYPE } from '../interfaces/reward'
import {
  CacheKey,
  STOCK_CACHE_INCREMENT_TTL,
  STOCK_LOCK_TTL,
  REWARD_IDS_TTL,
} from '../constants'
import { Reward } from '../entities/reward.entity'
import { RewardService } from './reward.service'

@Injectable()
export class LimitRewardService {
  private logger = new Logger('LimitRewardService')
  constructor(
    @InjectRedis() private redisClient: Redis,
    @InjectRedLock() private redlock: RedLock,
    @InjectRepository(Reward) private rewardRepository: Repository<Reward>,
    private readonly rewardService: RewardService,
  ) {}

  private async getLmitedRewardIds(gameId: number): Promise<number[]> {
    const key = CacheKey.limitedRewardIds(gameId)
    const [value, exists] = await Promise.all([
      this.redisClient.smembers(key),
      this.redisClient.exists(key),
    ])
    if (exists) {
      return value.map((v) => Number(v))
    }
    const records = await this.rewardRepository.find({
      select: ['id'],
      where: {
        gameId,
        probability: MoreThan(0),
        stockType: STOCK_TYPE.LIMITED,
        stockAmount: MoreThan(0),
      },
    })
    const result = records.map((reward: Reward) => reward.id)
    await this.redisClient.sadd(key, result)
    await this.redisClient.expire(key, REWARD_IDS_TTL)
    return result
  }

  private async getStock(id: number): Promise<number> {
    const key = CacheKey.rewardStock(id)
    let stock = await this.redisClient.get(key)
    if (stock) {
      this.redisClient.expire(key, STOCK_CACHE_INCREMENT_TTL)
      return Number(stock)
    }
    const lock = await this.redlock.lock(key, STOCK_LOCK_TTL)
    try {
      stock = await this.redisClient.get(key)
      if (stock) {
        return Number(stock)
      }
      const result = await this.selectStockFromDB(id)
      await this.redisClient.set(key, result)
      return result
    } catch (err) {
      throw new Error(err)
    } finally {
      await lock.unlock()
    }
  }

  async getRewards(gameId: number): Promise<Reward[]> {
    const ids = await this.getLmitedRewardIds(gameId)
    const result: Reward[] = []
    for (const id of ids) {
      const stock = await this.getStock(Number(id))
      if (stock > 0) {
        const reward = await this.rewardService.getRewardById(Number(id))
        result.push(reward)
      }
    }
    return result
  }

  private async selectStockFromDB(id: number): Promise<number> {
    const result = await this.rewardRepository.findOne(id, {
      select: ['id', 'stockAmount'],
      lock: {
        mode: 'pessimistic_write',
      },
    })
    return result.stockAmount
  }

  async decrementStock(id: number): Promise<number> {
    const key = CacheKey.rewardStock(id)
    const remainingAmount = await this.redisClient.decr(key)
    if (remainingAmount < 0) {
      this.logger.log(
        `reward cache stock overload -> ${key},  stock -> ${remainingAmount}`,
      )
      // rollback stock
      await this.redisClient.incr(key)
      throw new Error('stock overload')
    }
    try {
      const rows = await this.decrementStockFromDB(id)
      if (rows < 1) {
        throw new Error('none rewards has decrement stock')
      }
    } catch (err) {
      this.logger.error(err)
      // rollback stock
      await this.redisClient.incr(key)
      throw new Error('stock overload')
    }
    return remainingAmount
  }

  private async decrementStockFromDB(id: number): Promise<number> {
    const result = await this.rewardRepository.decrement(
      { id },
      'stockAmount',
      -1,
    )
    return result.affected
  }
}
