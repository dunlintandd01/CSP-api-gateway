import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as R from 'ramda'

import { getRedisToken } from '../../core/redis'
import { GameAdminController } from './gameAdmin.controller'
import { GameManageService } from '../services/gameManage.service'
import { PagesManageService } from '../services/pagesManage.service'
import { RewardManageService, Reward } from '../../reward'
import { Game, GamePage, LandingPage, ResultPageModule } from '../entities'
import { ThemeMode } from '../interfaces'
import { REWARD_TYPE, STOCK_TYPE } from '../../reward/interfaces/reward'
import { QuizService, Question, Answer } from '../../quiz'

describe('Game Admin Controller', () => {
  let controller: GameAdminController
  let rewardService: RewardManageService
  let quizService: QuizService

  const fakeID = 123
  const fakeUserName = 'tester'
  const fakeUser = { username: fakeUserName, userId: 'u123' }
  const game = { id: fakeID, name: 'testing game' }
  const page = { id: fakeID, gameId: fakeID }
  const reward = {
    id: fakeID,
    rewardType: REWARD_TYPE.POINTS,
    stockType: STOCK_TYPE.LIMITED,
    totalAmount: 1,
    probability: 1,
  }
  const theme = {
    mode: ThemeMode.dark,
    themeColor: '#000000',
    backgroundColor: '#000000',
    backgroundImage: 'string',
    desktopBannerImage: 'string',
    mobileBannerImage: 'string',
  }
  const question = {
    id: fakeID,
    answers: [
      {
        id: fakeID,
      },
    ],
  }

  class GameRepo {
    static findOne = jest.fn().mockResolvedValue(game)
    static save = jest.fn().mockImplementation((game) => {
      return game.id ? game : Object.assign({ id: fakeID }, game)
    })
    static create = jest.fn().mockImplementation((game) => game)
    static softDelete = jest.fn().mockResolvedValue(null)
    static update = jest.fn().mockResolvedValue(null)
  }

  class GamePageRepo {
    static findOne = jest.fn().mockResolvedValue(page)
    static save = jest.fn().mockImplementation((page) => {
      return page.id ? page : Object.assign({ id: fakeID }, page)
    })
    static softDelete = jest.fn().mockResolvedValue(null)
  }

  class RewardRepo {
    static softDelete = jest.fn().mockResolvedValue(null)
  }

  class QuestionRepo {
    static softDelete = jest.fn().mockResolvedValue(null)
  }

  class AnswerRepo {}
  class MockPageRepository {}
  class MockResultPageModule {}

  class RedisClient {
    static get = jest.fn().mockResolvedValue(JSON.stringify(game))
    static set = jest.fn().mockResolvedValue(true)
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GameAdminController],
      providers: [
        GameManageService,
        RewardManageService,
        QuizService,
        PagesManageService,
        {
          provide: getRepositoryToken(Game),
          useValue: GameRepo,
        },
        {
          provide: getRepositoryToken(GamePage),
          useValue: GamePageRepo,
        },
        {
          provide: getRepositoryToken(LandingPage),
          useValue: MockPageRepository,
        },
        {
          provide: getRepositoryToken(ResultPageModule),
          useValue: MockResultPageModule,
        },
        {
          provide: getRepositoryToken(Reward),
          useValue: RewardRepo,
        },
        {
          provide: getRepositoryToken(Question),
          useValue: QuestionRepo,
        },
        {
          provide: getRepositoryToken(Answer),
          useValue: AnswerRepo,
        },
        {
          provide: getRedisToken(),
          useValue: RedisClient,
        },
      ],
    }).compile()

    rewardService = moduleRef.get<RewardManageService>(RewardManageService)
    quizService = moduleRef.get<QuizService>(QuizService)
    controller = moduleRef.get<GameAdminController>(GameAdminController)
  })

  describe('find simple game', () => {
    it('should return a game', async () => {
      jest.spyOn(rewardService, 'getRewards').mockResolvedValueOnce([])
      expect(await controller.getGame(fakeID)).toBe(game)
    })
  })

  describe('create game', () => {
    it('should return a game', async () => {
      const result = await controller.createGame(
        { name: 'create a test game', theme },
        { user: fakeUser },
      )
      expect(result.id).toBe(fakeID)
      expect(result.code).toHaveLength(10)
      expect(result.createdBy).toBe(fakeUserName)
      expect(result.updatedBy).toBe(fakeUserName)
      expect(result.theme).toStrictEqual(
        R.merge(theme, { createdBy: fakeUserName, updatedBy: fakeUserName }),
      )
    })
  })

  describe('create game with rewards', () => {
    it('should return a game', async () => {
      jest
        .spyOn(rewardService, 'batchSave')
        .mockResolvedValueOnce([reward as Reward, reward as Reward])
      const result = await controller.createGame(
        {
          name: 'create a reward test game',
          rewards: [R.omit(['id'], reward), R.omit(['id'], reward)],
        },
        { user: fakeUser },
      )
      expect(result.id).toBe(fakeID)
      expect(result.code).toHaveLength(10)
      expect(result.createdBy).toBe(fakeUserName)
      expect(result.updatedBy).toBe(fakeUserName)
      expect(result.rewards).toStrictEqual([reward, reward])
    })
  })

  describe('create game with questions', () => {
    it('should return a game', async () => {
      jest
        .spyOn(quizService, 'saveQuestions')
        .mockResolvedValueOnce([question as Question])
      const result = await controller.createGame(
        {
          name: 'create a test game with questions',
          questions: [question],
        },
        { user: fakeUser },
      )
      expect(result.id).toBe(fakeID)
      expect(result.code).toHaveLength(10)
      expect(result.createdBy).toBe(fakeUserName)
      expect(result.updatedBy).toBe(fakeUserName)
      expect(result.questions).toStrictEqual([question])
    })
  })

  describe('update simple game', () => {
    it('should return a game', async () => {
      expect(
        await controller.updateGame(
          fakeID,
          { name: 'update a test game' },
          { user: fakeUser },
        ),
      ).toStrictEqual({
        id: fakeID,
        name: 'update a test game',
        updatedBy: fakeUserName,
      })
    })
  })

  describe('update game with rewards', () => {
    it('should return a game', async () => {
      jest
        .spyOn(rewardService, 'batchSave')
        .mockResolvedValueOnce([reward as Reward, reward as Reward])
      expect(
        await controller.updateGame(
          fakeID,
          { name: 'update a test game', rewards: [reward, reward] },
          { user: fakeUser },
        ),
      ).toStrictEqual({
        id: fakeID,
        name: 'update a test game',
        updatedBy: fakeUserName,
        rewards: [reward, reward],
      })
    })
  })

  describe('deleteOne', () => {
    it('should return void', async () => {
      expect(await controller.deleteGame(fakeID)).toBeUndefined()
    })
  })

  describe('publish game', () => {
    it('should call game update func', async () => {
      await controller.publishGame(fakeID)
      expect(GameRepo.update).toHaveBeenCalledWith(fakeID, {
        status: 'PUBLISHED',
      })
    })
  })

  describe('unpublish game', () => {
    it('should call game update func', async () => {
      await controller.unpublishGame(fakeID)
      expect(GameRepo.update).toHaveBeenCalledWith(fakeID, {
        status: 'DRAFT',
      })
    })
  })
})
