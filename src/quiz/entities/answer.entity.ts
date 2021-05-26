import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import {
  IsInt,
  IsString,
  IsEnum,
  IsDateString,
  IsObject,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { Operation } from '../../common'
import { Question } from './question.entity'
import {
  ANSWER_STATUS_ENUM,
  ANSWER_TYPE_ENUM,
  ANSWER_HINT_TYPE_ENUM,
} from '../interfaces'

@Entity()
@Index(['questionId', 'rank'])
export class Answer extends Operation {
  @IsInt()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  answerId: number

  @IsInt()
  @ApiProperty()
  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({ name: 'questionId' })
  @Index('answer_question_id_idx')
  question: Question

  @IsInt()
  @ApiProperty()
  @Column({ type: 'int', length: 11, default: 0 })
  rank: number

  @IsInt()
  @ApiProperty()
  @Column({ type: 'int', length: 11, default: 0 })
  score: number

  @IsString()
  @ApiProperty()
  @Column({ type: 'varchar' })
  attribute: string

  @IsEnum(ANSWER_STATUS_ENUM)
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ANSWER_STATUS_ENUM,
    default: ANSWER_STATUS_ENUM.NORMAL,
  })
  status: ANSWER_STATUS_ENUM

  @IsEnum(ANSWER_TYPE_ENUM)
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ANSWER_TYPE_ENUM,
    default: ANSWER_TYPE_ENUM.TEXT,
  })
  type: ANSWER_TYPE_ENUM

  @IsString()
  @ApiProperty()
  @Column({ type: 'text' })
  content: string

  @IsString()
  @ApiProperty()
  @Column({ type: 'varchar' })
  imageUrl: string

  @IsString()
  @ApiProperty()
  @Column({ type: 'text' })
  imageDescription: string

  @IsEnum(ANSWER_HINT_TYPE_ENUM)
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ANSWER_HINT_TYPE_ENUM,
    default: ANSWER_HINT_TYPE_ENUM.NONE,
  })
  hintType: ANSWER_HINT_TYPE_ENUM

  @IsObject()
  @ApiProperty()
  @Column({ type: 'simple-json' })
  hintContent: {
    articleText: string
    articleId: string
    imageUrl: string
    videoId: string
  }

  @IsDateString()
  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date

  @IsString()
  @ApiProperty()
  @Column({ type: 'varchar' })
  deletedBy: string
}
