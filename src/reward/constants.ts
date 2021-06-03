export const CacheKey = {
  reward: (id: string | number): string => `reward:${id}`,
  rewardStock: (id: string | number): string => `reward:${id}:stock`,
  lastReward: (referenceId: string | number): string =>
    `reference:${referenceId}:last_reward`,
  unLimitedRewardIds: (referenceId: string | number): string =>
    `reference:${referenceId}:unlimited_reward_ids`,
  limitedRewardIds: (referenceId: string | number): string =>
    `reference:${referenceId}:limited_reward_ids`,
}

export const STOCK_CACHE_INCREMENT_TTL = 60 * 30
export const STOCK_LOCK_TTL = 60 * 1000
export const REWARD_IDS_TTL = 60 * 1000
