import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Reward } from './entities'
import { LotteryService } from './services/lottery.service'
import { RewardService } from './services/reward.service'

@Module({
  imports: [TypeOrmModule.forFeature([Reward])],
  providers: [LotteryService, RewardService],
  exports: [RewardService],
})
export class RewardModule {}
