import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm'

import { Operation } from '../../common'
import { REWARD_TYPE, STOCK_TYPE } from '../interfaces/reward'

@Entity()
export class Reward extends Operation {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index('reference_idx')
  referenceId: number

  @Column({
    type: 'enum',
    enum: REWARD_TYPE,
  })
  rewardType: REWARD_TYPE

  @Column({
    type: 'enum',
    enum: STOCK_TYPE,
  })
  stockType: STOCK_TYPE

  @Column({
    type: 'decimal',
    precision: 7,
  })
  probability: number

  @Column({ type: 'int' })
  totalAmount: number

  @Column({ type: 'int' })
  stockAmount: number

  @Column()
  couponSkuId: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  backgroundImage: string

  @Column()
  buttonText: string

  @Column()
  buttonLink: string

  @Column({ type: 'smallint' })
  rank: number

  @DeleteDateColumn()
  deletedAt: Date
}
