import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm'
import { IsInt, IsDecimal, IsString, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { Operation } from '../../common'
import { REWARD_TYPE, STOCK_TYPE } from '../interfaces/reward'

@Entity()
export class Reward extends Operation {
  @IsInt()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @IsInt()
  @ApiProperty()
  @Column()
  @Index('reference_idx')
  referenceId: number

  @IsEnum(REWARD_TYPE)
  @ApiProperty({ enum: REWARD_TYPE })
  @Column({
    type: 'enum',
    enum: REWARD_TYPE,
  })
  rewardType: REWARD_TYPE

  @IsEnum(REWARD_TYPE)
  @ApiProperty({ enum: STOCK_TYPE })
  @Column({
    type: 'enum',
    enum: STOCK_TYPE,
  })
  stockType: STOCK_TYPE

  @IsDecimal()
  @ApiProperty()
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
  })
  probability: number

  @IsInt()
  @ApiProperty()
  @Column({ type: 'int' })
  totalAmount: number

  @IsInt()
  @ApiProperty()
  @Column({ type: 'int' })
  stockAmount: number

  @IsString()
  @ApiProperty()
  @Column()
  couponSkuId: string

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
  @Column()
  backgroundImage: string

  @IsString()
  @ApiProperty()
  @Column()
  buttonText: string

  @IsString()
  @ApiProperty()
  @Column()
  buttonLink: string

  @IsInt()
  @ApiProperty()
  @Column({ type: 'smallint' })
  rank: number

  @DeleteDateColumn()
  deletedAt: Date
}
