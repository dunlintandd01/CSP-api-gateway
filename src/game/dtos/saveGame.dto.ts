import { OmitType, PartialType, ApiPropertyOptional } from '@nestjs/swagger'

import { Game, GamePage, Theme } from '../entities'
import { SaveReward } from '../../reward'

export class SaveTheme extends PartialType(
  OmitType(Theme, [
    'id',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
  ] as const),
) {
  @ApiPropertyOptional()
  id?: number
}

export class SavePages extends PartialType(
  OmitType(GamePage, [
    'id',
    'game',
    'theme',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
  ] as const),
) {
  @ApiPropertyOptional()
  id?: number

  @ApiPropertyOptional({ type: SaveTheme })
  theme?: SaveTheme
}

export class SaveGameReq extends PartialType(
  OmitType(Game, [
    'id',
    'code',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'pages',
    'theme',
    'rewards',
  ] as const),
) {
  @ApiPropertyOptional({ type: [SavePages] })
  pages?: SavePages[]

  @ApiPropertyOptional({ type: SaveTheme })
  theme?: SaveTheme

  @ApiPropertyOptional({ type: [SaveReward] })
  rewards?: SaveReward[]
}
