import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Reward } from './entities'
import { RewardManageService } from './services/rewardManage.service'
import { RewardService } from './services/reward.service'
import { LimitRewardService } from './services/limitedReward.service'
import { LotteryService } from './services/lottery.service'
import { RewardInOrderService } from './services/rewardInOrder.service'

@Module({
  imports: [TypeOrmModule.forFeature([Reward])],
  providers: [
    LotteryService,
    RewardInOrderService,
    RewardManageService,
    RewardService,
    LimitRewardService,
  ],
  exports: [RewardManageService, LotteryService, RewardInOrderService],
})
export class RewardModule {}
