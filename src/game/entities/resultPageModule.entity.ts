import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import { IsInt, IsEnum, IsObject } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { Operation } from '../../common'
import { PAGE_RESULT_TYPE, CustomButtonMeta } from '../interfaces'
import { GamePage } from './gamePage.entity'

@Entity()
export class ResultPageModule extends Operation {
  @IsInt()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @IsInt()
  @ApiProperty()
  @ManyToOne(() => GamePage)
  page: GamePage

  @IsEnum(PAGE_RESULT_TYPE)
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: PAGE_RESULT_TYPE,
  })
  moduleType: PAGE_RESULT_TYPE

  @IsObject()
  @ApiProperty()
  @Column({ type: 'json' })
  metaData: CustomButtonMeta

  @IsInt()
  @ApiProperty()
  @Column({ type: 'smallint' })
  rank: number

  @DeleteDateColumn()
  deletedAt: Date
}
