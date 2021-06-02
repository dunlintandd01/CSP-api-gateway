import {
  Entity,
  Column,
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
import { ANSWER_TYPE_ENUM, ANSWER_HINT_TYPE_ENUM } from '../interfaces'

@Entity()
export class Answer extends Operation {
  @IsInt()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ type: () => Question })
  @ManyToOne(() => Question, (question) => question.answers)
  question: Question

  @IsInt()
  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  rank: number

  @IsInt()
  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  score: number

  @IsString()
  @ApiProperty()
  @Column({ type: 'varchar' })
  attribute: string

  @IsEnum(ANSWER_TYPE_ENUM)
  @ApiProperty({ enum: ANSWER_TYPE_ENUM, default: ANSWER_TYPE_ENUM.TEXT })
  @Column({
    type: 'enum',
    enum: ANSWER_TYPE_ENUM,
    default: ANSWER_TYPE_ENUM.TEXT,
  })
  type: ANSWER_TYPE_ENUM

  @IsString()
  @ApiProperty()
  @Column()
  content: string

  @IsString()
  @ApiProperty()
  @Column({ type: 'varchar' })
  imageUrl: string

  @IsString()
  @ApiProperty()
  @Column()
  imageDescription: string

  @IsEnum(ANSWER_HINT_TYPE_ENUM)
  @ApiProperty({
    enum: ANSWER_HINT_TYPE_ENUM,
    default: ANSWER_HINT_TYPE_ENUM.NONE,
  })
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
}
