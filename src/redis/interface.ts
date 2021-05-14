import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { RedisOptions } from 'ioredis';

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<RedisOptions>;
  useExisting?: Type<RedisOptions>;
  useFactory?: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
}
