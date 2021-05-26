import { Entity, Column, PrimaryColumn, DeleteDateColumn } from 'typeorm'

import { Operation } from '../../common'

@Entity()
export class LandingPage extends Operation {
  @PrimaryColumn()
  pageId: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  titleImage: string

  @Column()
  contenTtitle: string

  @Column()
  contentDescription: string

  @Column()
  contentImage: string

  @Column()
  startButtonText: string

  @Column()
  secondaryButtonText: string

  @Column()
  secondaryButtonLink: string

  @Column()
  customButtonText: string

  @Column()
  customButtonLink: string

  @DeleteDateColumn()
  deletedAt: Date
}
