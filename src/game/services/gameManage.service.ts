import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import * as R from 'ramda'

import { SaveGameReq } from '../dtos'
import { Game, GamePage, Theme } from '../entities'
import { RewardManageService } from '../../reward'

@Injectable()
export class GameManageService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(GamePage)
    private pageRepository: Repository<GamePage>,
    private readonly rewardService: RewardManageService,
  ) {}

  async saveGame(
    id: number | null,
    data: SaveGameReq,
    operator: string,
  ): Promise<Game> {
    let game = new Game()
    game = R.merge(data, game)
    if (id) {
      game.id = id
    } else {
      game.createdBy = operator
    }
    game.updatedBy = operator

    if (data.pages) {
      const pages = []
      for (const pageData of data.pages) {
        const page = new GamePage()
        if (pageData.id) {
          page.id = pageData.id
        } else {
          page.createdBy = operator
        }
        page.updatedBy = operator
        page.pageType = pageData.pageType
        page.rank = pageData.rank
        await this.pageRepository.save(page)
        if (pageData.theme) {
          const theme = new Theme()
          if (pageData.theme.id) {
            theme.id = pageData.theme.id
          }
          page.theme = theme
        }
        pages.push(page)
      }
      game.pages = pages
    }
    if (data.theme) {
      const theme = new Theme()
      if (data.theme.id) {
        theme.id = data.theme.id
      }
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

  async getWholeGame(id: number): Promise<Game> {
    const result = await this.gameRepository.findOne({
      relations: ['pages', 'theme'],
      where: { id },
    })
    result.rewards = await this.rewardService.getRewards(result.id)
    return result
  }

  async getGameList(
    search: string,
    page: number,
    pageSize: number,
  ): Promise<Game[]> {
    const where = {}
    if (search) {
      R.merge(where, { name: Like(`%${search}%`) })
    }
    const result = await this.gameRepository.find({
      where,
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
}