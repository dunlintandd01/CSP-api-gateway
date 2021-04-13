import {
  OnModuleInit,
  Inject,
  Controller,
  Get,
  Param,
  UseFilters,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { AllExceptionFilter } from '../middlewares/exception.filter';

interface HeroesService {
  findOne(data: { id: number }): Observable<any>;
}
interface Hero {
  id: number;
  name: string;
}

export class HeroError extends Error {
  errorCode: number;
  constructor(errorCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
  }
}

@Controller('hero')
@UseFilters(new AllExceptionFilter())
export class HeroController implements OnModuleInit {
  private heroesService: HeroesService;

  constructor(@Inject('HERO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.heroesService = this.client.getService<HeroesService>('HeroesService');
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Observable<Hero>> {
    // throw new Error('test');
    const result = await this.heroesService.findOne({ id: +id });
    return result;
  }
}
