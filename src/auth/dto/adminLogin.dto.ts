import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AdminLoginRequestDto {
  @IsString()
  @ApiProperty()
  authCode: string

  @IsString()
  @ApiProperty()
  redirectUrl: string
}
