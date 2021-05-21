import { Module, CacheModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GameService } from './game.service'
import { GameAdminController } from './gameAdmin.controller'
import { GameController } from './game.controller'

import { Game } from './entities/game.entity'

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('HTTP_CACHE_TTL'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Game]),
  ],
  controllers: [GameAdminController, GameController],
  providers: [GameService],
})
export class GameModule {}
