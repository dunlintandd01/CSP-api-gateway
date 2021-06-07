import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import { IsInt, IsString, IsEnum, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { Operation } from '../../common'
import { Question } from './question.entity'
import { ANSWER_TYPE_ENUM } from '../interfaces'

@Entity()
export class Answer extends Operation {
  @IsInt()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ type: () => Question })
  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  question: Question

  @Column()
  questionId: number

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

  @IsDateString()
  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date
}
