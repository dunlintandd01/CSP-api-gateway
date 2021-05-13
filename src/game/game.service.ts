import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Game } from './schemas';
import { IGame } from './interfaces';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<IGame>,
  ) {}

  async createGame(name: string): Promise<IGame> {
    const created = new this.gameModel({ name });
    return created.save();
  }

  async getGame(id: string): Promise<IGame> {
    return this.gameModel.findById(id);
  }
}
