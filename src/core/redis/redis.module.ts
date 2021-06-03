import { Module, Provider, DynamicModule, Logger } from '@nestjs/common'
import IORedis, { RedisOptions, Redis } from 'ioredis'
import * as RedLock from 'redlock'

import { getRedisToken, getRedLockToken } from './utils'
import { RedisModuleAsyncOptions } from './interface'
import { initRedLock } from './redlock'

@Module({})
export class RedisModule {
  static forRoot(options: RedisOptions): DynamicModule {
    const redisConnectionProvider: Provider = {
      provide: getRedisToken(),
      useValue: new IORedis(options),
    }
    const redLockProvider: Provider = {
      provide: getRedLockToken(),
      inject: [getRedisToken()],
      useFactory: (redisConnection: Redis): RedLock =>
        initRedLock(redisConnection),
    }
    return {
      global: true,
      module: RedisModule,
      providers: [redisConnectionProvider, redLockProvider],
      exports: [redisConnectionProvider, redLockProvider],
    }
  }
  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const redisConnectionProvider: Provider = {
      provide: getRedisToken(),
      useFactory(options: RedisOptions) {
        return new IORedis(options)
      },
    }
    const redLockProvider: Provider = {
      provide: getRedLockToken(),
      inject: [getRedisToken()],
      useFactory: (redisConnection: Redis): RedLock =>
        initRedLock(redisConnection),
    }

    return {
      global: true,
      module: RedisModule,
      imports: options.imports,
      providers: [redisConnectionProvider, redLockProvider],
      exports: [redisConnectionProvider, redLockProvider],
    }
  }
}
