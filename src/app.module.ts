import { Module } from '@nestjs/common';

import { HeroModule } from './hero/hero.module';
import { SeverModule } from './heroserver/app.module';

@Module({
  imports: [HeroModule, SeverModule],
})
export class AppModule {}
