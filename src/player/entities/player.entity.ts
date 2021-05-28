import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Player {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @Column()
  HK01AccountId: string

  @ApiProperty()
  @Column()
  deviceId: string

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date
}
