import { Injectable } from '@nestjs/common'
import { Repository, MoreThan } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Redis } from 'ioredis'
import * as R from 'ramda'

import { InjectRedis } from '../../core/redis'
import { STOCK_TYPE } from '../interfaces/reward'
import { Reward } from '../entities/reward.entity'
import { CacheKey, REWARD_IDS_TTL } from '../constants'

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    @InjectRedis() private redisClient: Redis,
  ) {}

  async getRewardById(id: number): Promise<Reward> {
    const cacheKey = CacheKey.reward(id)
    // NOTE: convert Record<string, string>, set unknown for now
    const cache: unknown = await this.redisClient.hgetall(cacheKey)
    if (cache) {
      return cache as Reward
    }
    const result = await this.rewardRepository.findOne(id)
    // NOTE: convert object to Map for type checking
    await this.redisClient.hmset(cacheKey, new Map(Object.entries(result)))
    return result
  }

  async getLastReward(gameId: number): Promise<Reward> {
    const cacheKey = CacheKey.lastReward(gameId)
    const cache: unknown = await this.redisClient.hgetall(cacheKey)
    if (cache) {
      return cache as Reward
    }
    const result = await this.rewardRepository.findOne({
      gameId,
      stockType: STOCK_TYPE.LAST_REWARD,
    })
    await this.redisClient.hmset(cacheKey, new Map(Object.entries(result)))
    return result
  }

  private async getUnlimitedRewardIds(gameId: number): Promise<number[]> {
    const key = CacheKey.unLimitedRewardIds(gameId)
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
    await this.redisClient.sadd(key, ...result)
    await this.redisClient.expire(key, REWARD_IDS_TTL)
    return result
  }

  async getUnlimitedRewards(gameId: number): Promise<Reward[]> {
    const ids = await this.getUnlimitedRewardIds(gameId)
    const result: Reward[] = []
    for (const id of ids) {
      const reward = await this.getRewardById(Number(id))
      result.push(reward)
    }
    return result
  }
}
