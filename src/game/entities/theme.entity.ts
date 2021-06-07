import {
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm'
import { IsEnum, IsInt, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { Operation } from '../../common'
import { ThemeMode } from '../interfaces'

@Entity()
export class Theme extends Operation {
  @PrimaryGeneratedColumn()
  @IsInt()
  @ApiProperty()
  id: number

  @IsEnum(ThemeMode)
  @ApiProperty()
  @Column({
    type: 'enum',
    default: ThemeMode.light,
    enum: ThemeMode,
  })
  mode: ThemeMode

  @IsString()
  @ApiProperty()
  @Column({ type: 'varchar', length: 20 })
  themeColor: string

  @IsString()
  @ApiProperty()
  @Column({ type: 'varchar', length: 20 })
  backgroundColor: string

  @IsString()
  @ApiProperty()
  @Column()
  backgroundImage: string

  @IsString()
  @ApiProperty()
  @Column()
  desktopBannerImage: string

  @IsString()
  @ApiProperty()
  @Column()
  mobileBannerImage: string

  @DeleteDateColumn()
  deletedAt: Date
}
