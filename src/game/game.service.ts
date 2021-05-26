import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Redis } from 'ioredis'

import { Game, GamePage } from './entities'
import { InjectRedis } from '../core/redis'
import { RewardService, Reward } from '../reward'

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(GamePage)
    private pageRepository: Repository<GamePage>,
    @InjectRedis() private redisClient: Redis,
    private readonly rewardService: RewardService,
  ) {}

  async createGame(
    name: string,
    relations?: { pages?: GamePage[]; rewards?: Reward[] },
  ): Promise<Game> {
    const newGame = this.gameRepository.create({ name })
    const result = await this.gameRepository.save(newGame)
    if (relations.pages) {
      await this.pageRepository.save(relations.pages)
    }
    if (relations.rewards) {
      await this.rewardService.batchSave(relations.rewards)
    }
    return result
  }

  async updateGame(id: number, game: Game): Promise<void> {
    await this.gameRepository.update(id, game)
    return
  }

  async getGame(id: number): Promise<Game> {
    const result = await this.gameRepository
      .createQueryBuilder('game')
      .select('game.name')
      .select('page.id')
      .where('game.id = :id', { id })
      .leftJoinAndSelect('game.pages', 'page')
      .orderBy({
        'page.rank': 'ASC',
      })
      .getOne()
    return result
  }

  async getGameList(
    search: string,
    page: number,
    pageSize: number,
  ): Promise<Game[]> {
    const result = await this.gameRepository.find({
      where: {
        name: Like(`%${search}%`),
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
