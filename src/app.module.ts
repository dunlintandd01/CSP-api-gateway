import { Module } from '@nestjs/common';

import { HeroModule } from './hero/hero.module';
import { ThirdPartyModule } from './thirdParty/thirdParty.module';

@Module({
  imports: [HeroModule, ThirdPartyModule.forRoot()],
})
export class AppModule {}
