import { Module, CacheModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RewardModule } from '../reward'
import { QuizModule } from '../quiz'

import { GameManageService } from './services/gameManage.service'
import { GameService } from './services/game.service'
import { GameAdminController } from './controllers/gameAdmin.controller'
import { GameController } from './controllers/game.controller'
import { PagesManageService } from './services/pagesManage.service'
import {
  Game,
  GamePage,
  Theme,
  LandingPage,
  ResultPageModule,
} from './entities'

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('HTTP_CACHE_TTL'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Game,
      GamePage,
      Theme,
      LandingPage,
      ResultPageModule,
    ]),
    RewardModule,
    QuizModule,
  ],
  controllers: [GameAdminController, GameController],
  providers: [GameService, GameManageService, PagesManageService],
})
export class GameModule {}
