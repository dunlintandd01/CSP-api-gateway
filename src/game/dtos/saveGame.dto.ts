import { OmitType, ApiProperty } from '@nestjs/swagger'

import { Game, GamePage } from '../entities'

export class SavePages extends OmitType(GamePage, [
  'id',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
] as const) {}

export class SaveGameReq extends OmitType(Game, [
  'id',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
  'pages',
] as const) {
  @ApiProperty({ type: [SavePages] })
  pages: SavePages[]
}
