import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Redis } from 'ioredis'
import * as R from 'ramda'

import { SaveGameReq } from './dtos'
import { Game, GamePage, Theme } from './entities'
import { InjectRedis } from '../core/redis'
import { RewardService } from '../reward'

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

  async createGame(data: SaveGameReq, operator: string): Promise<Game> {
    let game = new Game()
    game = R.merge(data, game)
    game.createdBy = operator
    game.updatedBy = operator

    if (data.pages) {
      const pages = []
      for (let pageData of data.pages) {
        let page = new GamePage()
        page.createdBy = operator
        page.updatedBy = operator
        page.pageType = pageData.pageType
        page.rank = pageData.rank
        await this.pageRepository.save(page)
        if (pageData.theme) {
          let theme = new Theme()
          page.theme = theme
        }
        pages.push(page)
      }
      game.pages = pages
    }
    if (data.theme) {
      let theme = new Theme()
      game.theme = theme
    }

    const result = await this.gameRepository.save(game)

    if (data.rewards) {
      result.rewards = await this.rewardService.batchSave(
        result.id,
        data.rewards,
        operator,
      )
    }

    return result
  }

  async updateGame(id: number, data: SaveGameReq): Promise<void> {
    let game = new Game()
    game = Object.assign(game, data)
    await this.gameRepository.update(id, game)
    return
  }

  async getGame(id: number): Promise<Game> {
    const result = await this.gameRepository.findOne({
      relations: ['pages'],
      where: { id },
    })
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
