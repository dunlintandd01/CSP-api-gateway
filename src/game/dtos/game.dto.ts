import { IsInt, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GameDto {
  @IsInt()
  @ApiProperty()
  id: number

  @IsString()
  @ApiProperty()
  name: string
}
