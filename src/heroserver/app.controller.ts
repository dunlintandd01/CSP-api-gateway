import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export interface HeroById {
  id: number;
}

export interface Hero {
  id: number;
  name: string;
}

@Controller()
export class HeroesService {
  private readonly items: Hero[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];

  @GrpcMethod()
  findOne(data: HeroById): Hero {
    return this.items.find(({ id }) => id === data.id);
  }
}
