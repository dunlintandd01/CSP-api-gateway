import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as R from 'ramda'

import { Reward } from '../entities'
import { SaveReward } from '../dtos/saveReward.dto'

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
  ) {}

  async batchSave(
    referenceId: number,
    rewards: SaveReward[],
    operator: string,
  ): Promise<Reward[]> {
    const rewardList = []
    for (const reward of rewards) {
      const newReward = new Reward()
      if (reward.id) {
        newReward.id = reward.id
      } else {
        newReward.createdBy = operator
      }
      newReward.referenceId = referenceId
      newReward.updatedBy = operator
      rewardList.push(R.merge(newReward, reward))
    }
    const result = await this.rewardRepository.save(rewardList)
    return result
  }

  async getRewards(referenceId: number): Promise<Reward[]> {
    const result = await this.rewardRepository.find({
      where: { referenceId },
    })
    return result
  }
}
