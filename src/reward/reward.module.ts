import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Reward } from './entities'
import { LotteryService } from './services/lottery.service'
import { RewardManageService } from './services/rewardManage.service'
import { RewardService } from './services/reward.service'
import { LimitRewardService } from './services/limitedReward.service'

@Module({
  imports: [TypeOrmModule.forFeature([Reward])],
  providers: [
    LotteryService,
    RewardManageService,
    RewardService,
    LimitRewardService,
  ],
  exports: [RewardManageService, LotteryService],
})
export class RewardModule {}
