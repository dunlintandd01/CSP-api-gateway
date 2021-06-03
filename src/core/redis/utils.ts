import {
  REDIS_MODULE_CONNECTION_TOKEN,
  REDIS_MODULE_RED_LOCK_TOKEN,
} from './constants'

export function getRedisToken() {
  return REDIS_MODULE_CONNECTION_TOKEN
}

export function getRedLockToken() {
  return REDIS_MODULE_RED_LOCK_TOKEN
}
