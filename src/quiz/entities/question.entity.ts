import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
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
import { Answer } from './answer.entity'
import { QUESTION_TYPE_ENUM, QUESTION_HINT_TYPE_ENUM } from '../interfaces'

@Entity()
@Index(['referenceId', 'rank'])
export class Question extends Operation {
  @IsInt()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @IsInt()
  @ApiProperty()
  @Column({ type: 'int' })
  @Index('question_reference_id_idx')
  referenceId: number

  @OneToMany(() => Answer, (answer) => answer.question, {
    cascade: true,
  })
  answers: Answer[]

  @IsInt()
  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  rank: number

  @IsString()
  @ApiProperty()
  @Column()
  title: string

  @IsString()
  @ApiProperty()
  @Column()
  description: string

  @IsString()
  @ApiProperty()
  @Column({ type: 'varchar' })
  imageUrl: string

  @IsInt()
  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  multipled: number

  @IsEnum(QUESTION_TYPE_ENUM)
  @ApiProperty({ enum: QUESTION_TYPE_ENUM, default: QUESTION_TYPE_ENUM.TEXT })
  @Column({
    type: 'enum',
    enum: QUESTION_TYPE_ENUM,
    default: QUESTION_TYPE_ENUM.TEXT,
  })
  type: QUESTION_TYPE_ENUM

  @IsEnum(QUESTION_HINT_TYPE_ENUM)
  @ApiProperty({
    enum: QUESTION_HINT_TYPE_ENUM,
    default: QUESTION_HINT_TYPE_ENUM.NONE,
  })
  @Column({
    type: 'enum',
    enum: QUESTION_HINT_TYPE_ENUM,
    default: QUESTION_HINT_TYPE_ENUM.NONE,
  })
  hintType: QUESTION_HINT_TYPE_ENUM

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
