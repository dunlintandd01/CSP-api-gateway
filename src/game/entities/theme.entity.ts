import { Entity, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'
import { IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { Operation } from '../../common'

@Entity()
export class Theme extends Operation {
  @PrimaryGeneratedColumn()
  @IsInt()
  @ApiProperty()
  id: number

  @DeleteDateColumn()
  deletedAt: Date
}
