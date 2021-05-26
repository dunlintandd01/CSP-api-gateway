import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
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
import {
  GAME_STATUS_ENUM,
  GAME_PLAYER_AGENT_MODE,
  GAME_PLAYER_AUTH_MODE,
  GAME_REWARD_TYPE,
} from '../interfaces'
import { Theme } from './theme.entity'
import { GamePage } from './gamePage.entity'

@Entity()
export class Game extends Operation {
  @IsInt()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @IsString()
  @ApiProperty()
  @Column()
  @Index('game_name_idx')
  name: string

  @IsString()
  @ApiProperty()
  @Column({ type: 'text' })
  description: string

  @IsString()
  @ApiProperty()
  @Column({ type: 'text' })
  remarks: string

  @IsString()
  @ApiProperty()
  @Column()
  image: string

  @IsEnum(GAME_STATUS_ENUM)
  @ApiProperty()
  @Column({
    type: 'enum',
    default: GAME_STATUS_ENUM.DRAFT,
    enum: GAME_STATUS_ENUM,
  })
  @Index('game_status_idx')
  status: GAME_STATUS_ENUM

  @IsDateString()
  @ApiProperty()
  @Column({ type: 'datetime' })
  startTime: Date

  @IsDateString()
  @ApiProperty()
  @Column({ type: 'datetime' })
  endTime: Date

  @IsEnum(GAME_PLAYER_AGENT_MODE)
  @ApiProperty()
  @Column({
    type: 'enum',
    default: GAME_PLAYER_AGENT_MODE.NONE,
    enum: GAME_PLAYER_AGENT_MODE,
  })
  playerAgentMode: GAME_PLAYER_AGENT_MODE

  @IsEnum(GAME_PLAYER_AUTH_MODE)
  @ApiProperty()
  @Column({
    type: 'enum',
    default: GAME_PLAYER_AUTH_MODE.NONE,
    enum: GAME_PLAYER_AUTH_MODE,
  })
  playerAuthMode: GAME_PLAYER_AUTH_MODE

  @IsInt()
  @ApiProperty()
  @Column({ type: 'int' })
  maxAttempCount: number

  @IsEnum(GAME_REWARD_TYPE)
  @ApiProperty()
  @Column({
    type: 'enum',
    default: GAME_REWARD_TYPE.RANK,
    enum: GAME_REWARD_TYPE,
  })
  rewardType: GAME_REWARD_TYPE

  @IsBoolean()
  @ApiProperty()
  @Column({ type: 'bool' })
  isShowterms: boolean

  @IsString()
  @ApiProperty()
  @Column()
  termsTitle: string

  @IsString()
  @ApiProperty()
  @Column({ type: 'text' })
  termsDescription: string

  @IsString()
  @ApiProperty()
  @Column({ type: 'text' })
  termsDetail: string

  @IsString()
  @ApiProperty()
  @Column()
  ogTitle: string

  @IsString()
  @ApiProperty()
  @Column()
  ogDescription: string

  @IsString()
  @ApiProperty()
  @Column()
  ogImage: string

  @OneToOne(() => Theme)
  @JoinColumn()
  theme: Theme

  @OneToMany(() => GamePage, (page) => page.game)
  @ApiProperty({ type: [GamePage] })
  pages: GamePage[]

  @DeleteDateColumn()
  deletedAt: Date
}
