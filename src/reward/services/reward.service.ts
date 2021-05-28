import { Injectable } from '@nestjs/common'

import { Reward } from '../entities/reward.entity'

@Injectable()
export class RewardService {
  constructor() {}

  async getRewardById(id: number): Promise<Reward> {
    return new Reward()
  }

  async getLastReward(id: number): Promise<Reward> {
    return new Reward()
  }

  async rewardInOrder() {}
}
