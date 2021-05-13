import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DatabasesModule } from '../databases/databases.module';

import { GameService } from './game.service';
import { gameProviders } from './game.provider';
import { GameAdminController } from './controllers/gameAdmin.controller';
import { GameController } from './controllers/game.controller';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    DatabasesModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: configService.get('cacheManager.ttl'),
        max: configService.get('cacheManager.max'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [GameAdminController, GameController],
  providers: [GameService, ...gameProviders],
})
export class GameModule {}
