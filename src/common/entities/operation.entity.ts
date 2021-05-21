import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class Operation {
  @CreateDateColumn()
  createdAt: Date

  @Column()
  createdBy: string

  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  updatedBy: string
}
