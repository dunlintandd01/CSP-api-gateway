import { Module } from '@nestjs/common';
import { HeroesService } from './app.controller';

@Module({
  controllers: [HeroesService],
  providers: [],
})
export class SeverModule {}
