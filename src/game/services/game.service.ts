import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Game } from '../entities'
import { InjectRedis } from '../../core/redis'
import { CacheKey } from '../constants'

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRedis() private redisClient: Redis,
  ) {}

  async getGameWithCache(code: string): Promise<Game> {
    const cacheKey = CacheKey.game(code)
    const cache = await this.redisClient.get(cacheKey)
    if (cache) {
      return JSON.parse(cache)
    }
    let result
    if (!cache) {
      result = await this.gameRepository.findOne({
        where: {
          code,
        },
        select: [
          'id',
          'name',
          'description',
          'startTime',
          'endTime',
          'image',
          'maxAttempCount',
          'playerAgentMode',
          'playerAuthMode',
          'ogTitle',
          'ogDescription',
          'ogImage',
          'isShowterms',
          'termsTitle',
          'termsDescription',
          'termsDetail',
        ],
      })
      await this.redisClient.set(cacheKey, JSON.stringify(result))
    }
    return result
  }
}
