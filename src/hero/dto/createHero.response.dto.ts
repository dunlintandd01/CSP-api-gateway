import { IsInt, IsString } from 'class-validator';

import { Hero } from '../interfaces/hero.interface';

export class CreateHeroResponseDto implements Hero {
  @IsInt()
  id: number;

  @IsString()
  name: string;
}
