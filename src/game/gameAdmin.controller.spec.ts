import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { getRedisToken } from '../redis';
import { GameAdminController } from './gameAdmin.controller';
import { GameService } from './game.service';
import { Game } from './schemas';

describe('CatsController', () => {
  let controller: GameAdminController;
  // let service: GameService;
  const game = { _id: 'testID', name: 'testing game' };

  class GameModel {
    constructor(private data) {}
    save = jest.fn().mockResolvedValue(this.data);
    static find = jest.fn().mockResolvedValue([game]);
    static findOne = jest.fn().mockResolvedValue(game);
    static findById = jest.fn().mockResolvedValue(game);
    static findOneAndUpdate = jest.fn().mockResolvedValue(game);
    static deleteOne = jest.fn().mockResolvedValue(true);
  }

  class RedisClient {
    static get = jest.fn().mockResolvedValue(JSON.stringify(game));
    static set = jest.fn().mockResolvedValue(true);
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GameAdminController],
      providers: [
        GameService,
        {
          provide: getModelToken(Game.name),
          useValue: GameModel,
        },
        {
          provide: getRedisToken(),
          useValue: RedisClient,
        },
      ],
    }).compile();

    // service = moduleRef.get<GameService>(GameService);
    controller = moduleRef.get<GameAdminController>(GameAdminController);
  });

  describe('findOne', () => {
    it('should return a game', async () => {
      // jest.spyOn(service, 'getGame').mockResolvedValueOnce(game);
      expect(await controller.getGame('testID')).toBe(game);
    });
  });

  describe('createOne', () => {
    it('should return a game', async () => {
      // jest.spyOn(service, 'getGame').mockResolvedValueOnce(game);
      expect(
        await controller.createGame({ name: 'create a test game' }),
      ).toStrictEqual({
        name: 'create a test game',
      });
    });
  });
});
