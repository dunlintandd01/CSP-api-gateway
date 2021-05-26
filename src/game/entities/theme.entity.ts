import { Entity, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

import { Operation } from '../../common'

@Entity()
export class Theme extends Operation {
  @PrimaryGeneratedColumn()
  id: number

  @DeleteDateColumn()
  deletedAt: Date
}
