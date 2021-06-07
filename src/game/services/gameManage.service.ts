import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import * as R from 'ramda'
import { urlAlphabet, customAlphabet } from 'nanoid'

import { SaveGameReq, SaveTheme, SavePage } from '../dtos'
import { GAME_STATUS_ENUM, PAGE_TYPE } from '../interfaces'
import { Game, GamePage, Theme } from '../entities'
import { RewardManageService } from '../../reward'
import { QuizService } from '../../quiz'
import { PagesManageService } from './pagesManage.service'

const nanoid = customAlphabet(urlAlphabet, 10)

@Injectable()
export class GameManageService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(GamePage)
    private pageRepository: Repository<GamePage>,
    private readonly rewardService: RewardManageService,
    private readonly quizService: QuizService,
    private readonly pagesManageService: PagesManageService,
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
      // NOTE: not checking duplicate IDs because of game data not increment that fast, and if collision, just try save again
      // reference: https://zelark.github.io/nano-id-cc/
      game.code = nanoid()
      game.createdBy = operator
    }
    game.updatedBy = operator

    if (data.pages) {
      game.pages = await this.newPages(data.pages, operator)
    }
    if (data.theme) {
      game.theme = this.newTheme(data.theme, operator)
    }

    const result = await this.gameRepository.save(game)

    if (data.rewards) {
      result.rewards = await this.rewardService.batchSave(
        result.id,
        data.rewards,
        operator,
      )
    }

    if (data.questions) {
      result.questions = await this.quizService.saveQuestions(
        result.id,
        data.questions,
        operator,
      )
    }

    return result
  }

  private newTheme(data: SaveTheme, operator: string): Theme {
    let theme = new Theme()
    if (data.id) {
      theme.id = data.id
    } else {
      theme.createdBy = operator
    }
    theme.updatedBy = operator
    theme = R.merge(data, theme)
    return theme
  }

  private async newPages(
    data: SavePage[],
    operator: string,
  ): Promise<GamePage[]> {
    let pages: GamePage[]
    for (const pageData of data) {
      const page = new GamePage()
      if (pageData.id) {
        page.id = pageData.id
      } else {
        page.createdBy = operator
      }
      page.updatedBy = operator
      page.pageType = pageData.pageType
      page.rank = pageData.rank
      if (pageData.theme) {
        page.theme = this.newTheme(pageData.theme, operator)
      }
      const result = await this.pageRepository.save(page)
      switch (page.pageType) {
        case PAGE_TYPE.LANDING:
          await this.pagesManageService.saveLandingPage(
            result,
            pageData.landingPage,
          )
          break
        case PAGE_TYPE.RESULT:
          await this.pagesManageService.saveResultPageModules(
            result,
            pageData.resultPageModules,
          )
          break
        default:
          break
      }
      pages.push(page)
    }
    return pages
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
    await this.quizService.deleteQuestions(id)
    await this.rewardService.deleteRewards(id)
    return
  }

  async publishGame(id: number): Promise<void> {
    await this.gameRepository.update(id, { status: GAME_STATUS_ENUM.PUBLISHED })
    return
  }

  async unpublishGame(id: number): Promise<void> {
    await this.gameRepository.update(id, { status: GAME_STATUS_ENUM.DRAFT })
    return
  }
}
