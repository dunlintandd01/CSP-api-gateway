import { Module } from '@nestjs/common';
import { HeroesService } from './herosvc.controller';

@Module({
  controllers: [HeroesService],
  providers: [],
})
export class HeroSVCModule {}
