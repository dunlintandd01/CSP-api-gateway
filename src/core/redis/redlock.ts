import { Logger } from '@nestjs/common'
import { Redis } from 'ioredis'
import * as RedLock from 'redlock'

export function initRedLock(redisConnection: Redis): RedLock {
  const redlock = new RedLock([redisConnection], {
    // the expected clock drift; for more details
    // see http://redis.io/topics/distlock
    driftFactor: 0.01, // multiplied by lock ttl to determine drift time
    // the max number of times Redlock will attempt
    // to lock a resource before erroring
    retryCount: 30,
    // the time in ms between attempts
    retryDelay: 300, // time in ms
    // the max time in ms randomly added to retries
    // to improve performance under high contention
    // see https://www.awsarchitectureblog.com/2015/03/backoff.html
    retryJitter: 200, // time in ms
  })

  redlock.on('clientError', (err) => {
    new Logger('Redis Module').error(err)
  })

  return redlock
}
