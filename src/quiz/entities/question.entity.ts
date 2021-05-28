import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { IsInt, IsString, IsEnum, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { Operation } from '../../common'
import { Answer } from './answer.entity'
import { QUESTION_TYPE_ENUM } from '../interfaces'

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
  @Column({ type: 'text' })
  title: string

  @IsString()
  @ApiProperty()
  @Column({ type: 'text' })
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
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: QUESTION_TYPE_ENUM,
    default: QUESTION_TYPE_ENUM.TEXT,
  })
  type: QUESTION_TYPE_ENUM

  @IsDateString()
  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date
}
