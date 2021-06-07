import { Injectable } from '@nestjs/common'
import * as R from 'ramda'
import * as Chance from 'chance'

import { RewardService } from './reward.service'
import { LimitRewardService } from './limitedReward.service'
import { STOCK_TYPE } from '../interfaces/reward'
import { Reward } from '../entities'

@Injectable()
export class LotteryService {
  constructor(
    private readonly rewardService: RewardService,
    private readonly limitRewardService: LimitRewardService,
  ) {}

  async lottery(gameId: number, userId: number): Promise<Reward> {
    let lotteryReward: Reward | null
    let instantStock: number
    let retryCount = 5
    try {
      while (retryCount > 0) {
        const inStockLimitedRewards = await this.limitRewardService.getRewards(
          gameId,
        )
        const unlimitedRewards: Reward[] =
          await this.rewardService.getUnlimitedRewards(gameId)
        if (inStockLimitedRewards.length > 0) {
          lotteryReward = new Chance().weighted(
            R.concat(inStockLimitedRewards, unlimitedRewards),
            R.concat(inStockLimitedRewards, unlimitedRewards).map(
              (reward: Reward) => Number(reward.probability),
            ),
          )
          // decrement stock
          if (lotteryReward.stockType == STOCK_TYPE.LIMITED) {
            try {
              instantStock = await this.limitRewardService.decrementStock(
                lotteryReward.id,
              )
              break
            } catch (err) {
              retryCount -= 1
              continue
            }
          } else {
            break
          }
        } else if (unlimitedRewards.length > 0) {
          lotteryReward = new Chance().weighted(
            unlimitedRewards,
            unlimitedRewards.map((reward: Reward) =>
              Number(reward.probability),
            ),
          )
          break
        } else {
          const lastReward = await this.rewardService.getLastReward(gameId)
          lotteryReward = lastReward
          break
        }
      }
    } catch (err) {
      throw new Error(err)
    }

    if (retryCount < 1) {
      throw new Error('lottery error, over retry count')
    }

    if (!lotteryReward) {
      throw new Error('lottery error, can not get lottery reward')
    }

    return lotteryReward
  }
}
