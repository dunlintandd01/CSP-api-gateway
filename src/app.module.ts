import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { HeroModule } from './hero/hero.module';
import { ThirdPartyModule } from './thirdParty/thirdParty.module';
import { GameModule } from './game/game.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    HeroModule,
    ThirdPartyModule,
    GameModule,
  ],
})
export class AppModule {}
