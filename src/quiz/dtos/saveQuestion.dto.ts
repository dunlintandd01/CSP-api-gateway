import { OmitType, PartialType, ApiPropertyOptional } from '@nestjs/swagger'

import { Question, Answer } from '../entities'

export class SaveAnswer extends PartialType(
  OmitType(Answer, [
    'id',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'question',
  ] as const),
) {
  @ApiPropertyOptional()
  id?: number
}
export class SaveQuestion extends PartialType(
  OmitType(Question, [
    'gameId',
    'pageId',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'answers',
  ] as const),
) {
  @ApiPropertyOptional()
  id?: number

  @ApiPropertyOptional({ type: [SaveAnswer] })
  answers?: SaveAnswer[]
}
