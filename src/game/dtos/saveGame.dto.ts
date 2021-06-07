import { OmitType, PartialType, ApiPropertyOptional } from '@nestjs/swagger'

import {
  Game,
  GamePage,
  Theme,
  LandingPage,
  ResultPageModule,
} from '../entities'
import { SaveReward } from '../../reward'
import { SaveQuestion } from '../../quiz'

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

export class SaveLandingPage extends PartialType(
  OmitType(LandingPage, ['id'] as const),
) {
  @ApiPropertyOptional()
  id?: number
}

export class SaveResultPageModule extends PartialType(
  OmitType(ResultPageModule, [
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

export class SavePage extends PartialType(
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

  @ApiPropertyOptional({ type: SaveLandingPage })
  landingPage?: SaveLandingPage

  @ApiPropertyOptional({ type: [SaveResultPageModule] })
  resultPageModules?: SaveResultPageModule[]
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
    'questions',
  ] as const),
) {
  @ApiPropertyOptional({ type: [SavePage] })
  pages?: SavePage[]

  @ApiPropertyOptional({ type: SaveTheme })
  theme?: SaveTheme

  @ApiPropertyOptional({ type: [SaveReward] })
  rewards?: SaveReward[]

  @ApiPropertyOptional({ type: [SaveQuestion] })
  questions?: SaveQuestion[]
}
