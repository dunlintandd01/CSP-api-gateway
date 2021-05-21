import { Module, Provider, DynamicModule } from '@nestjs/common';
import IORedis, { RedisOptions } from 'ioredis';

import { getRedisToken } from './utils';
import { RedisModuleAsyncOptions } from './interface';

@Module({})
export class RedisModule {
  static forRoot(options: RedisOptions): DynamicModule {
    const redisConnectionProvider: Provider = {
      provide: getRedisToken(),
      useValue: new IORedis(options),
    };
    return {
      global: true,
      module: RedisModule,
      providers: [redisConnectionProvider],
      exports: [redisConnectionProvider],
    };
  }
  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const redisConnectionProvider: Provider = {
      provide: getRedisToken(),
      useFactory(options: RedisOptions) {
        return new IORedis(options);
      },
    };

    return {
      global: true,
      module: RedisModule,
      imports: options.imports,
      providers: [redisConnectionProvider],
      exports: [redisConnectionProvider],
    };
  }
}
