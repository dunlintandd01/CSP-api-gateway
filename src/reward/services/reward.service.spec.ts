import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as R from 'ramda'

import { REWARD_TYPE, STOCK_TYPE, Reward, RewardService } from '../'

describe('RewardService', () => {
  let rewardService: RewardService

  const fakeID = 123
  const fakeUserName = 'tester'
  const reward = {
    id: fakeID,
    rewardType: REWARD_TYPE.POINTS,
    stockType: STOCK_TYPE.LIMITED,
    totalAmount: 1,
    probability: 1,
  }

  class RewardRepo {
    static find = jest.fn().mockResolvedValue([reward])
    static save = jest.fn().mockImplementation((rewards) => {
      const result = []
      for (const data of rewards) {
        const temp = data.id ? reward : Object.assign({ id: fakeID }, reward)
        result.push(temp)
      }
      return result
    })
    static softDelete = jest.fn().mockResolvedValue(null)
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RewardService,
        {
          provide: getRepositoryToken(Reward),
          useValue: RewardRepo,
        },
      ],
    }).compile()

    rewardService = moduleRef.get<RewardService>(RewardService)
  })

  describe('save', () => {
    it('should return an array of rewards', async () => {
      const data = [reward, R.omit(['id'], reward)]
      expect(
        await rewardService.batchSave(fakeID, data, fakeUserName),
      ).toStrictEqual([reward, reward])
    })
  })

  describe('get rewards', () => {
    it('should return an array of rewards', async () => {
      expect(await rewardService.getRewards(fakeID)).toStrictEqual([reward])
    })
  })
})
