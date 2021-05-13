import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from './config/configuration';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { HeroModule } from './hero/hero.module';
import { GameModule } from './game/game.module';

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
    AuthModule,
    HeroModule,
    GameModule,
  ],
})
export class AppModule {}
