import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm'
import { IsInt, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { Operation } from '../../common'
import { PAGE_TYPE } from '../interfaces'
import { Game } from './game.entity'
import { Theme } from './theme.entity'

@Entity()
export class GamePage extends Operation {
  @IsInt()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Game, (game) => game.pages)
  @Index('game_idx')
  game: Game

  @IsEnum(PAGE_TYPE)
  @ApiProperty({ enum: PAGE_TYPE })
  @Column({ type: 'enum', enum: PAGE_TYPE })
  pageType: PAGE_TYPE

  @ApiProperty()
  @OneToOne(() => Theme)
  theme: Theme | null

  @IsInt()
  @ApiProperty()
  @Column({ type: 'smallint' })
  rank: number

  @DeleteDateColumn()
  deletedAt: Date
}
