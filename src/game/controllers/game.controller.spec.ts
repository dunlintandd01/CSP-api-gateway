import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { getRedisToken } from '../../core/redis'
import { GameController } from './game.controller'
import { GameService } from '../services/game.service'
import { Game, GamePage } from '../entities'

describe('Game Controller', () => {
  let controller: GameController
  const fakeID = 123
  const game = { id: fakeID, name: 'testing game' }
  const page = { id: fakeID, gameId: fakeID }

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
    static save = jest.fn().mockImplementation(() => {
      return page.id ? page : Object.assign({ id: fakeID }, page)
    })
    static create = jest.fn().mockImplementation(() => page)
    static softDelete = jest.fn().mockResolvedValue(null)
    static update = jest.fn().mockResolvedValue(null)
  }

  class RewardRepo {
    static findOne = jest.fn().mockResolvedValue(page)
    static save = jest.fn().mockImplementation(() => {
      return page.id ? page : Object.assign({ id: fakeID }, page)
    })
    static create = jest.fn().mockImplementation(() => page)
    static softDelete = jest.fn().mockResolvedValue(null)
    static update = jest.fn().mockResolvedValue(null)
  }

  class RedisClient {
    static get = jest.fn().mockResolvedValue(JSON.stringify(game))
    static set = jest.fn().mockResolvedValue(true)
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useValue: GameRepo,
        },
        {
          provide: getRepositoryToken(GamePage),
          useValue: GamePageRepo,
        },
        {
          provide: getRedisToken(),
          useValue: RedisClient,
        },
      ],
    }).compile()

    controller = moduleRef.get<GameController>(GameController)
  })

  describe('get game missing cache', () => {
    it('should return a game', async () => {
      expect(await controller.getGame(fakeID)).toStrictEqual(game)
    })
  })

  describe('get game hit cache', () => {
    it('should return a game', async () => {
      expect(await controller.getGame(fakeID)).toStrictEqual(game)
    })
  })
})
