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

  async getRewardIds(referenceId: number): Promise<number[]> {
    return []
  }

  async lottery(referenceId: number, userId: number) {
    let lotteryReward: Reward | null = null
    let instantStock = 0
    const rewardIds = await this.getRewardIds(referenceId)
    const rewards = await Promise.all(
      rewardIds.map((rewardId) => this.rewardService.getRewardById(rewardId)),
    )
    let retryCount = 5
    try {
      while (retryCount > 0) {
        let inStockLimitedLotteryRewardList: Reward[] = []
        let unlimitedLotteryRewardList: Reward[] = []
        for (let reward of rewards) {
          if (reward.stockType == STOCK_TYPE.UNLIMITED) {
            unlimitedLotteryRewardList.push(reward)
          }
          if (reward.stockType == STOCK_TYPE.LIMITED) {
            const stock = await this.limitRewardService.getStock(reward.id)
            if (stock > 0) {
              instantStock = stock
              inStockLimitedLotteryRewardList.push(reward)
            }
          }
        }
        if (inStockLimitedLotteryRewardList.length > 0) {
          lotteryReward = new Chance().weighted(
            R.concat(
              inStockLimitedLotteryRewardList,
              unlimitedLotteryRewardList,
            ),
            R.concat(
              inStockLimitedLotteryRewardList,
              unlimitedLotteryRewardList,
            ).map((reward: Reward) => Number(reward.probability)),
          )

          // decrement stock
          if (lotteryReward.stockType == STOCK_TYPE.LIMITED) {
            const status = await this.limitRewardService.decrementStock(
              lotteryReward.id,
            )
            if (!status) {
              retryCount -= 1
              continue
            }
          }
          break
        } else if (unlimitedLotteryRewardList.length > 0) {
          lotteryReward = new Chance().weighted(
            unlimitedLotteryRewardList,
            unlimitedLotteryRewardList.map((reward: Reward) =>
              Number(reward.probability),
            ),
          )
          break
        } else {
          const lastReward = await this.rewardService.getLastReward(referenceId)
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
  }
}
