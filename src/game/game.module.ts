import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameService } from './game.service';
import { Game, GameSchema } from './schemas';
import { GameAdminController } from './controllers/gameAdmin.controller';
import { GameController } from './controllers/game.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameAdminController, GameController],
  providers: [GameService],
})
export class GameModule {}
