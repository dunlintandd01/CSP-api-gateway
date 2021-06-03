import { Injectable } from '@nestjs/common'
import * as R from 'ramda'

import { RewardService } from './reward.service'
import { LimitRewardService } from './limitedReward.service'
import { Reward } from '../entities'
import { STOCK_TYPE } from '../interfaces/reward'

@Injectable()
export class RewardInOrderService {
  constructor(
    private readonly rewardService: RewardService,
    private readonly limitRewardService: LimitRewardService,
  ) {}

  async reward(referenceId: number, userId: number): Promise<Reward> {
    let retryCount = 5
    let result: Reward
    let instantStock: number
    try {
      while (retryCount > 0) {
        const limitedRewards = await this.limitRewardService.getRewards(
          referenceId,
        )
        const unlimitedRewards = await this.rewardService.getUnlimitedRewards(
          referenceId,
        )
        const rewards = await R.sortBy(R.prop('rank'))(
          limitedRewards.concat(unlimitedRewards),
        )
        const reward = rewards.shift()
        if (reward.stockType == STOCK_TYPE.LIMITED) {
          // try decrement stock
          try {
            instantStock = await this.limitRewardService.decrementStock(
              reward.id,
            )
            result = reward
            break
          } catch (e) {
            retryCount--
            continue
          }
        } else if (reward.stockType == STOCK_TYPE.UNLIMITED) {
          result = reward
          break
        } else {
          const lastReward = await this.rewardService.getLastReward(referenceId)
          result = lastReward
          break
        }
      }
    } catch (err) {
      throw new Error(err)
    }
    return result
  }
}
