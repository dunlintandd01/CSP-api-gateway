export const CacheKey = {
  reward: (id: string | number): string => `reward:${id}`,
  rewardStock: (id: string | number): string => `reward:${id}:stock`,
  lastReward: (gameId: string | number): string =>
    `reference:${gameId}:last_reward`,
  unLimitedRewardIds: (gameId: string | number): string =>
    `reference:${gameId}:unlimited_reward_ids`,
  limitedRewardIds: (gameId: string | number): string =>
    `reference:${gameId}:limited_reward_ids`,
}

export const STOCK_CACHE_INCREMENT_TTL = 60 * 30
export const STOCK_LOCK_TTL = 60 * 1000
export const REWARD_IDS_TTL = 60 * 1000
