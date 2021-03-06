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

import { Reward } from '../../reward'
import { Operation } from '../../common'
import {
  GAME_STATUS_ENUM,
  GAME_PLAYER_AGENT_MODE,
  GAME_PLAYER_AUTH_MODE,
  GAME_REWARD_TYPE,
} from '../interfaces'
import { Theme } from './theme.entity'
import { GamePage } from './gamePage.entity'
import { Question } from '../../quiz'

@Entity()
export class Game extends Operation {
  @IsInt()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @Index('game_code_idx')
  @Column({ type: 'varchar', length: 10, unique: true })
  code: string

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
  @ApiProperty({
    enum: GAME_STATUS_ENUM,
    default: GAME_STATUS_ENUM.DRAFT,
  })
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
  @ApiProperty({
    enum: GAME_PLAYER_AGENT_MODE,
    default: GAME_PLAYER_AGENT_MODE.NONE,
  })
  @Column({
    type: 'enum',
    default: GAME_PLAYER_AGENT_MODE.NONE,
    enum: GAME_PLAYER_AGENT_MODE,
  })
  playerAgentMode: GAME_PLAYER_AGENT_MODE

  @IsEnum(GAME_PLAYER_AUTH_MODE)
  @ApiProperty({
    enum: GAME_PLAYER_AUTH_MODE,
    default: GAME_PLAYER_AUTH_MODE.NONE,
  })
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
  @ApiProperty({
    default: GAME_REWARD_TYPE.RANK,
    enum: GAME_REWARD_TYPE,
  })
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
  @ApiProperty({ type: Theme })
  @JoinColumn()
  theme: Theme

  @ApiProperty({ type: GamePage, isArray: true })
  @OneToMany(() => GamePage, (page) => page.game)
  pages: GamePage[]

  @ApiProperty({ type: Reward, isArray: true })
  rewards: Reward[]

  @ApiProperty({ type: Question, isArray: true })
  @OneToMany(() => Question, (question) => question.gameId)
  questions: Question[]

  @DeleteDateColumn()
  deletedAt: Date
}
