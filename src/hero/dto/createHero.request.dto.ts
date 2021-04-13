import { IsString } from 'class-validator';

export class CreateHeroRequestDto {
  @IsString()
  name: string;
}
