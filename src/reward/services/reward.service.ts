import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Reward } from '../entities'

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
  ) {}

  async batchSave(rewards: Reward[]): Promise<null> {
    await this.rewardRepository.save(rewards)
    return
  }

  async getRewards(referenceId: number): Promise<Reward[]> {
    const result = await this.rewardRepository.find({
      where: { referenceId },
    })
    return result
  }
}
