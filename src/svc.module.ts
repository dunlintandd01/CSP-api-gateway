import { Module } from '@nestjs/common';

import { HeroSVCModule } from './heroscv/herosvc.module';

@Module({
  imports: [HeroSVCModule],
})
export class SVCAppModule {}
