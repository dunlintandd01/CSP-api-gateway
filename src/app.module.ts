import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { HeroModule } from './hero/hero.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, HeroModule],
})
export class AppModule {}
