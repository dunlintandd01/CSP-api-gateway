import { OmitType, PartialType, ApiPropertyOptional } from '@nestjs/swagger'

import { Game, GamePage } from '../entities'

export class SavePages extends PartialType(
  OmitType(GamePage, [
    'id',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
  ] as const),
) {}

export class SaveGameReq extends PartialType(
  OmitType(Game, [
    'id',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'pages',
    'theme',
  ] as const),
) {
  @ApiPropertyOptional({ type: [SavePages] })
  pages?: SavePages[]
}
