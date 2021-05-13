import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Game } from './interfaces/game.interface';

@Injectable()
export class GameService {
  constructor(
    @Inject('GAME_MODEL')
    private gameModel: Model<Game>,
  ) {}

  async createGame(name: string): Promise<Game> {
    const created = new this.gameModel({ name });
    return created.save();
  }

  async getGame(id: string): Promise<Game> {
    return this.gameModel.findById(id).exec();
  }
}
