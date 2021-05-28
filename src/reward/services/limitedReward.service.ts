import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

import { InjectRedis } from '../../core/redis'

@Injectable()
export class LimitRewardService {
  constructor(@InjectRedis() private redisClient: Redis) {}

  async getStock(id: number): Promise<number> {
    return 1
  }

  async decrementStock(id: number): Promise<boolean> {
    return true
  }
}
