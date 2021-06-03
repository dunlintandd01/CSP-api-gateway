import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { getRedisToken } from '../../core/redis'
import { Reward, STOCK_TYPE } from '../'
import { RewardService } from './reward.service'

describe('LimitRewardService', () => {
  let service: RewardService

  const fakeID = 123
  const fakeReferenceID = 321
  const fakeReward = {
    id: fakeID,
    referenceId: fakeReferenceID,
    stockType: STOCK_TYPE.UNLIMITED,
    totalAmount: 1,
    probability: 1,
    stockAmount: 1,
  }

  class MockRewardRepo {
    static find = jest.fn().mockResolvedValue([fakeReward])
    static findOne = jest.fn().mockResolvedValue(fakeReward)
  }
  class MockRedis {
    static smembers = jest.fn().mockResolvedValue([fakeID])
    static exists = jest.fn()
    static sadd = jest.fn().mockResolvedValue(1)
    static expire = jest.fn().mockResolvedValue(1)
    static hgetall = jest.fn()
    static hmset = jest.fn().mockResolvedValue('OK')
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RewardService,
        {
          provide: getRepositoryToken(Reward),
          useValue: MockRewardRepo,
        },
        {
          provide: getRedisToken(),
          useValue: MockRedis,
        },
      ],
    }).compile()

    service = moduleRef.get<RewardService>(RewardService)
  })

  describe('get unlimited rewards with cache test', () => {
    it('should return a reward list', async () => {
      // set reward set exists
      MockRedis.exists.mockResolvedValueOnce(true)
      // get reward from redis
      MockRedis.hgetall.mockResolvedValueOnce(fakeReward)

      expect(await service.getUnlimitedRewards(fakeReferenceID)).toStrictEqual([
        fakeReward,
      ])
    })
  })

  describe('get unlimited rewards without cache test', () => {
    it('should return a reward list', async () => {
      // set reward set not exists
      MockRedis.exists.mockResolvedValueOnce(false)
      // missing reward from redis
      MockRedis.hgetall.mockResolvedValueOnce(null)

      expect(await service.getUnlimitedRewards(fakeReferenceID)).toStrictEqual([
        fakeReward,
      ])
    })
  })
})
