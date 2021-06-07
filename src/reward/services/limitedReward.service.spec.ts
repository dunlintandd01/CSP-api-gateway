import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { getRedLockToken, getRedisToken } from '../../core/redis'
import { Reward, STOCK_TYPE } from '../'
import { LimitRewardService } from './limitedReward.service'
import { RewardService } from './reward.service'

describe('LimitRewardService', () => {
  let service: LimitRewardService

  const fakeID = 123
  const fakeGameID = 321
  const fakeReward = {
    id: fakeID,
    gameId: fakeGameID,
    stockType: STOCK_TYPE.LIMITED,
    totalAmount: 1,
    probability: 1,
    stockAmount: 1,
  }

  class MockRewardRepo {
    static find = jest.fn().mockResolvedValue([fakeReward])
    static findOne = jest.fn().mockResolvedValue(fakeReward)
  }
  class MockRewardService {
    static getRewardById = jest.fn().mockResolvedValue(fakeReward)
  }
  class MockRedis {
    static smembers = jest.fn().mockResolvedValue([fakeID])
    static exists = jest.fn()
    static sadd = jest.fn().mockResolvedValue(1)
    static expire = jest.fn().mockResolvedValue(1)
    static get = jest.fn()
    static set = jest.fn().mockResolvedValue('OK')
  }
  class MockRedLock {
    static lock = jest.fn().mockResolvedValue({
      unlock: jest.fn(),
    })
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LimitRewardService,
        {
          provide: RewardService,
          useValue: MockRewardService,
        },
        {
          provide: getRepositoryToken(Reward),
          useValue: MockRewardRepo,
        },
        {
          provide: getRedisToken(),
          useValue: MockRedis,
        },
        {
          provide: getRedLockToken(),
          useValue: MockRedLock,
        },
      ],
    }).compile()

    service = moduleRef.get<LimitRewardService>(LimitRewardService)
  })

  describe('get limited rewards with cache test', () => {
    it('should return a reward list', async () => {
      // set reward set exists
      MockRedis.exists.mockResolvedValueOnce(true)
      // set stock 1
      MockRedis.get.mockResolvedValueOnce(1)
      expect(await service.getRewards(fakeGameID)).toStrictEqual([fakeReward])
    })
  })

  describe('get limited rewards without cache test', () => {
    it('should return a reward list', async () => {
      // set reward set not exists
      MockRedis.exists.mockResolvedValueOnce(false)
      // set stock not exists
      MockRedis.get.mockResolvedValueOnce(null)
      expect(await service.getRewards(fakeGameID)).toStrictEqual([fakeReward])
    })
  })
})
