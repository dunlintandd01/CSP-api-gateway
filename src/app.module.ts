import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from './config/configuration';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';

// import { HeroModule } from './hero/hero.module';
import { GameModule } from './game/game.module';
import { ThirdPartyModule } from './thirdParty/thirdParty.module';
@Module({
  imports: [
    HealthModule,
    // TODO: add validation
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        user: configService.get<string>('MONGO_USER'),
        pass: configService.get<string>('MONGO_PASS'),
        dbName: configService.get<string>('MONGO_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST'),
        port: Number(configService.get<string>('REDIS_PORT')),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    // HeroModule,
    GameModule,
    ThirdPartyModule,
  ],
})
export class AppModule {}
