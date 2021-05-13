import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GameDto {
  @IsString()
  @ApiProperty()
  _id: string;

  @IsString()
  @ApiProperty()
  name: string;
}
