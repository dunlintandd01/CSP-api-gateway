import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import {
  IsInt,
  IsBoolean,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { Operation } from '../../common'
import { PAGE_TYPE } from '../interfaces'
import { Game } from './game.entity'

@Entity()
export class GamePage extends Operation {
  @IsInt()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Game, (game) => game.pages)
  @Index('game_idx')
  game: number

  @IsEnum(PAGE_TYPE)
  @ApiProperty()
  @Column({ type: 'enum', enum: PAGE_TYPE })
  pageType: PAGE_TYPE

  @IsInt()
  @ApiProperty()
  @Column({ type: 'int' })
  themeId: number

  @IsInt()
  @ApiProperty()
  @Column({ type: 'smallint' })
  rank: number

  @DeleteDateColumn()
  deletedAt: Date
}
