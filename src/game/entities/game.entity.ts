import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { GAME_STATUS } from '../interfaces'

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ default: 'DRAFT' })
  status: string
}
