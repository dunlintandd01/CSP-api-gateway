import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Game } from '../entities'
import { InjectRedis } from '../../core/redis'

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRedis() private redisClient: Redis,
  ) {}

  async getGameWithCache(id: number): Promise<Game> {
    const cacheKey = `game_data:${id}`
    const cache = await this.redisClient.get(cacheKey)
    if (cache) {
      return JSON.parse(cache)
    }
    let result
    if (!cache) {
      result = await this.gameRepository.findOne(id)
      await this.redisClient.set(cacheKey, JSON.stringify(result))
    }
    return result
  }
}
