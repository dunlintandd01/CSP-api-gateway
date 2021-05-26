import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
export abstract class Operation {
  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date

  @Column()
  @ApiProperty()
  createdBy: string

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date

  @Column()
  @ApiProperty()
  updatedBy: string
}
