import { Inject } from '@nestjs/common'

import { getRedisToken, getRedLockToken } from './utils'

export const InjectRedis = () => {
  return Inject(getRedisToken())
}

export const InjectRedLock = () => {
  return Inject(getRedLockToken())
}
