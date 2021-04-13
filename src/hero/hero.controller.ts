import { OnModuleInit, Inject, Controller, Get, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface HeroesService {
  findOne(data: { id: number }): Observable<any>;
}
interface Hero {
  id: number;
  name: string;
}

@Controller('hero')
export class HeroController implements OnModuleInit {
  private heroesService: HeroesService;

  constructor(@Inject('HERO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.heroesService = this.client.getService<HeroesService>('HeroesService');
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<Hero> {
    return this.heroesService.findOne({ id: +id });
  }
}
