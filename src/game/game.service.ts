import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Redis } from 'ioredis';

import { Game } from './schemas';
import { IGame } from './interfaces';
import { InjectRedis } from '../redis';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<IGame>,
    @InjectRedis() private redisClient: Redis,
  ) {}

  async createGame(name: string): Promise<IGame> {
    const created = new this.gameModel({ name });
    return created.save();
  }

  async getGame(id: string): Promise<IGame> {
    return this.gameModel.findById(id);
  }

  async getGameWithCache(id: string): Promise<IGame> {
    const cacheKey = `game_data:${id}`;
    const cache = await this.redisClient.get(cacheKey);
    if (cache) {
      return JSON.parse(cache);
    }
    let result;
    if (!cache) {
      result = await this.gameModel.findById(id);
      await this.redisClient.set(cacheKey, JSON.stringify(result));
    }
    return result;
  }
}
