import { Test } from '@nestjs/testing'

import { STOCK_TYPE, LotteryService } from '..'
import { RewardService } from './reward.service'
import { LimitRewardService } from './limitedReward.service'

describe('RewardInOrderService', () => {
  let service: LotteryService

  const fakeID = 123
  const fakeReferenceID = 321

  class MockRewardService {
    static getUnlimitedRewards = jest.fn()
    static getRewardById = jest.fn()
    static getLastReward = jest.fn()
  }

  class MockLimitRewardService {
    static getRewards = jest.fn()
    static decrementStock = jest.fn().mockResolvedValue(true)
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LotteryService,
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

    service = moduleRef.get<LotteryService>(LotteryService)
  })

  describe('lottery a limited reward test', () => {
    it('should return a reward', async () => {
      MockLimitRewardService.getRewards.mockResolvedValueOnce([
        {
          id: fakeID + 1,
          referenceId: fakeReferenceID,
          stockType: STOCK_TYPE.LIMITED,
          totalAmount: 1,
          probability: 0.998,
        },
        {
          id: fakeID + 2,
          referenceId: fakeReferenceID,
          stockType: STOCK_TYPE.LIMITED,
          totalAmount: 1,
          probability: 0.001,
        },
      ])
      MockRewardService.getUnlimitedRewards.mockResolvedValueOnce([
        {
          id: fakeID + 3,
          referenceId: fakeReferenceID,
          stockType: STOCK_TYPE.UNLIMITED,
          totalAmount: 1,
          probability: 0.001,
        },
      ])
      expect(await service.lottery(fakeReferenceID, fakeID)).toStrictEqual({
        id: fakeID + 1,
        referenceId: fakeReferenceID,
        stockType: STOCK_TYPE.LIMITED,
        totalAmount: 1,
        probability: 0.998,
      })
    })
  })

  describe('lottery a unlimited reward test', () => {
    it('should return a reward', async () => {
      MockLimitRewardService.getRewards.mockResolvedValueOnce([
        {
          id: fakeID + 1,
          referenceId: fakeReferenceID,
          stockType: STOCK_TYPE.LIMITED,
          totalAmount: 1,
          probability: 0.001,
        },
        {
          id: fakeID + 2,
          referenceId: fakeReferenceID,
          stockType: STOCK_TYPE.LIMITED,
          totalAmount: 1,
          probability: 0.001,
        },
      ])
      MockRewardService.getUnlimitedRewards.mockResolvedValueOnce([
        {
          id: fakeID + 3,
          referenceId: fakeReferenceID,
          stockType: STOCK_TYPE.UNLIMITED,
          totalAmount: 1,
          probability: 0.998,
        },
      ])
      expect(await service.lottery(fakeReferenceID, fakeID)).toStrictEqual({
        id: fakeID + 3,
        referenceId: fakeReferenceID,
        stockType: STOCK_TYPE.UNLIMITED,
        totalAmount: 1,
        probability: 0.998,
      })
    })
  })

  describe('lottery only got unlimited reward test', () => {
    it('should return a reward', async () => {
      MockLimitRewardService.getRewards.mockResolvedValueOnce([])
      MockRewardService.getUnlimitedRewards.mockResolvedValueOnce([
        {
          id: fakeID + 3,
          referenceId: fakeReferenceID,
          stockType: STOCK_TYPE.UNLIMITED,
          totalAmount: 1,
          probability: 0.002,
        },
        {
          id: fakeID + 4,
          referenceId: fakeReferenceID,
          stockType: STOCK_TYPE.UNLIMITED,
          totalAmount: 1,
          probability: 0.998,
        },
      ])
      MockLimitRewardService.getRewards.mockRejectedValueOnce([])
      expect(await service.lottery(fakeReferenceID, fakeID)).toStrictEqual({
        id: fakeID + 4,
        referenceId: fakeReferenceID,
        stockType: STOCK_TYPE.UNLIMITED,
        totalAmount: 1,
        probability: 0.998,
      })
    })
  })
})
