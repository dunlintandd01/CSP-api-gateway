import { Module } from '@nestjs/common';

import { DatabaseModule } from '../mongo/mongo.module';

import { GameService } from './game.service';
import { gameProviders } from './game.provider';
import { GameController } from './game.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [GameController],
  providers: [GameService, ...gameProviders],
})
export class GameModule {}
