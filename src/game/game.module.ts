import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { GameService } from './game.service';
import { Game, GameSchema } from './schemas';
import { GameAdminController } from './gameAdmin.controller';
import { GameController } from './game.controller';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('HTTP_CACHE_TTL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameAdminController, GameController],
  providers: [GameService],
})
export class GameModule {}
