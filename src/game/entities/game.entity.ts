import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm'

import { Operation } from '../../common'
import { GAME_STATUS_ENUM } from '../interfaces'

@Entity()
export class Game extends Operation {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index('game_name_idx')
  name: string

  @Column({ default: GAME_STATUS_ENUM.DRAFT, enum: GAME_STATUS_ENUM })
  @Index('game_status_idx')
  status: string

  @DeleteDateColumn()
  deletedAt: Date
}
