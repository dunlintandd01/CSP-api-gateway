import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { IsInt, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { Operation } from '../../common'
import { GamePage } from './gamePage.entity'

@Entity()
export class LandingPage extends Operation {
  @IsInt()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @IsInt()
  @ApiProperty()
  @OneToOne(() => GamePage)
  @JoinColumn()
  page: GamePage

  @IsString()
  @ApiProperty()
  @Column()
  title: string

  @IsString()
  @ApiProperty()
  @Column({ type: 'text' })
  description: string

  @IsString()
  @ApiProperty()
  @Column()
  startButtonText: string

  @IsString()
  @ApiProperty()
  @Column()
  customButtonText: string

  @IsString()
  @ApiProperty()
  @Column()
  customButtonLink: string

  @DeleteDateColumn()
  deletedAt: Date
}
