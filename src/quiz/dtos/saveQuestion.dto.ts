import { OmitType, PartialType, ApiPropertyOptional } from '@nestjs/swagger'

import { Question, Answer } from '../entities'

export class SaveAnswerReq extends PartialType(
  OmitType(Answer, [
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
export class SaveQuestionReq extends PartialType(
  OmitType(Question, [
    'referenceId',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'answers',
  ] as const),
) {
  @ApiPropertyOptional()
  id?: number

  @ApiPropertyOptional({ type: [SaveAnswerReq] })
  answers?: SaveAnswerReq[]
}
