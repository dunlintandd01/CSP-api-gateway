import { OmitType, PartialType, ApiPropertyOptional } from '@nestjs/swagger'

import { Reward } from '../entities'

export class SaveReward extends PartialType(
  OmitType(Reward, [
    'id',
    'gameId',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
  ] as const),
) {
  @ApiPropertyOptional()
  id?: number
}
