import {
  OnModuleInit,
  Inject,
  Controller,
  Get,
  Param,
  UseFilters,
  UseGuards,
  Post,
  Body,
  Request,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AdminAuthGuard } from '../auth/guards/admin.guard';
import { AllExceptionFilter } from '../middlewares/exception.filter';
import { CreateHeroRequestDto, CreateHeroResponseDto } from './dto';

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
@ApiBearerAuth()
@UseFilters(new AllExceptionFilter())
export class HeroController implements OnModuleInit {
  private heroesService: HeroesService;

  constructor(@Inject('HERO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.heroesService = this.client.getService<HeroesService>('HeroesService');
  }

  @UseGuards(AdminAuthGuard)
  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Request() req,
  ): Promise<Observable<Hero>> {
    // throw new Error('test');
    console.log('==== req.user', req.user);
    const result = await this.heroesService.findOne({ id: +id });
    return result;
  }

  @Post()
  async create(
    @Body() createHeroInput: CreateHeroRequestDto,
  ): Promise<CreateHeroResponseDto> {
    const hero = { id: 1, name: createHeroInput.name };
    return hero;
  }
}
