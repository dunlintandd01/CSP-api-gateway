import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm'

import { Operation } from '../../common'
import { PAGE_RESULT_TYPE, CustomButtonMeta } from '../interfaces'

@Entity()
export class ResultPageModule extends Operation {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  pageId: number

  @Column({
    type: 'enum',
    enum: PAGE_RESULT_TYPE,
  })
  moduleType: PAGE_RESULT_TYPE

  @Column({ type: 'json' })
  metaData: CustomButtonMeta

  @Column({ type: 'smallint' })
  rank: number

  @DeleteDateColumn()
  deletedAt: Date
}
