import { Inject } from '@nestjs/common';
import { getRedisToken } from './utils';

export const InjectRedis = () => {
  return Inject(getRedisToken());
};
