import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { getRedisToken } from '../core/redis'
import { GameAdminController } from './gameAdmin.controller'
import { GameService } from './game.service'
import { Game } from './entities/game.entity'

describe('Game Admin Controller', () => {
  let controller: GameAdminController
  // let service: GameService;
  const fakeID = 123
  const game = { id: fakeID, name: 'testing game' }

  class GameRepo {
    static findOne = jest.fn().mockResolvedValue(game)
    static save = jest.fn().mockImplementation((game) => {
      return game.id ? game : Object.assign({ id: fakeID }, game)
    })
    static create = jest.fn().mockImplementation((game) => game)
    static softDelete = jest.fn().mockResolvedValue(null)
    static update = jest.fn().mockResolvedValue(null)
  }

  class RedisClient {
    static get = jest.fn().mockResolvedValue(JSON.stringify(game))
    static set = jest.fn().mockResolvedValue(true)
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GameAdminController],
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useValue: GameRepo,
        },
        {
          provide: getRedisToken(),
          useValue: RedisClient,
        },
      ],
    }).compile()

    // service = moduleRef.get<GameService>(GameService);
    controller = moduleRef.get<GameAdminController>(GameAdminController)
  })

  describe('findOne', () => {
    it('should return a game', async () => {
      // jest.spyOn(service, 'getGame').mockResolvedValueOnce(game);
      expect(await controller.getGame(fakeID)).toBe(game)
    })
  })

  describe('createOne', () => {
    it('should return a game', async () => {
      // jest.spyOn(service, 'getGame').mockResolvedValueOnce(game);
      expect(
        await controller.createGame({ name: 'create a test game' }),
      ).toStrictEqual({
        id: fakeID,
        name: 'create a test game',
      })
    })
  })

  describe('updateOne', () => {
    it('should return void', async () => {
      expect(
        await controller.updateGame(fakeID, { name: 'update a test game' }),
      ).toBeUndefined()
    })
  })

  describe('deleteOne', () => {
    it('should return void', async () => {
      expect(await controller.deleteGame(fakeID)).toBeUndefined()
    })
  })
})
