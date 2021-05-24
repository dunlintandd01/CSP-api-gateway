import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Redis } from 'ioredis'

import { Game } from './entities/game.entity'
import { InjectRedis } from '../core/redis'

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRedis() private redisClient: Redis,
  ) {}

  async createGame(name: string): Promise<Game> {
    const newGame = this.gameRepository.create({ name })
    const result = await this.gameRepository.save(newGame)
    return result
  }

  async updateGame(id: number, game: Game): Promise<void> {
    await this.gameRepository.update(id, game)
    return
  }

  async getGame(id: number): Promise<Game> {
    return this.gameRepository.findOne(id)
  }

  async getGameList(
    search: string,
    page: number,
    pageSize: number,
  ): Promise<Game[]> {
    const result = await this.gameRepository.find({
      where: {
        name: Like('%out #%'),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    })
    return result
  }

  async deleteGame(id: number): Promise<void> {
    await this.gameRepository.softDelete(id)
    return
  }

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
