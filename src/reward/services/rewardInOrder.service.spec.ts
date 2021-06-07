import { Test } from '@nestjs/testing'
import * as R from 'ramda'

import { REWARD_TYPE, STOCK_TYPE, RewardInOrderService } from '..'
import { RewardService } from './reward.service'
import { LimitRewardService } from './limitedReward.service'

describe('RewardInOrderService', () => {
  let service: RewardInOrderService

  const fakeID = 123
  const fakeGameID = 321
  const rewards = [
    {
      id: fakeID + 1,
      gameId: fakeGameID,
      rewardType: REWARD_TYPE.POINTS,
      stockType: STOCK_TYPE.LIMITED,
      totalAmount: 1,
      probability: 1,
      rank: 1,
    },
    {
      id: fakeID + 2,
      gameId: fakeGameID,
      rewardType: REWARD_TYPE.POINTS,
      stockType: STOCK_TYPE.LIMITED,
      totalAmount: 1,
      probability: 1,
      rank: 2,
    },
    {
      id: fakeID + 3,
      gameId: fakeGameID,
      rewardType: REWARD_TYPE.POINTS,
      stockType: STOCK_TYPE.UNLIMITED,
      totalAmount: 1,
      probability: 1,
      rank: 3,
    },
  ]

  class MockRewardService {
    static getUnlimitedRewards = jest
      .fn()
      .mockResolvedValue(
        rewards.filter((v) => v.stockType == STOCK_TYPE.UNLIMITED),
      )
    static getRewardById = jest
      .fn()
      .mockImplementation((id) => R.find(R.propEq('id', id))(rewards))
    static getLastReward = jest.fn()
  }

  class MockLimitRewardService {
    static getRewards = jest
      .fn()
      .mockResolvedValue(
        rewards.filter((v) => v.stockType == STOCK_TYPE.LIMITED),
      )
    static decrementStock = jest.fn().mockResolvedValue(true)
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RewardInOrderService,
        {
          provide: RewardService,
          useValue: MockRewardService,
        },
        {
          provide: LimitRewardService,
          useValue: MockLimitRewardService,
        },
      ],
    }).compile()

    service = moduleRef.get<RewardInOrderService>(RewardInOrderService)
  })

  describe('reward in order test', () => {
    it('should return a reward', async () => {
      expect(await service.reward(fakeGameID, fakeID)).toStrictEqual({
        id: fakeID + 1,
        gameId: fakeGameID,
        rewardType: REWARD_TYPE.POINTS,
        stockType: STOCK_TYPE.LIMITED,
        totalAmount: 1,
        probability: 1,
        rank: 1,
      })
    })
  })

  describe('reward in order while reward stock has ran out', () => {
    it('should return a reward', async () => {
      MockLimitRewardService.decrementStock.mockImplementationOnce(() => {
        throw new Error()
      })
      MockLimitRewardService.decrementStock.mockResolvedValueOnce(true)
      expect(await service.reward(fakeGameID, fakeID)).toStrictEqual({
        id: fakeID + 1,
        gameId: fakeGameID,
        rewardType: REWARD_TYPE.POINTS,
        stockType: STOCK_TYPE.LIMITED,
        totalAmount: 1,
        probability: 1,
        rank: 1,
      })
    })
  })
})
