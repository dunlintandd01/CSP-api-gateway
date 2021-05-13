import {
  Controller,
  Get,
  Param,
  CacheInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { GameService } from './game.service';
import { GameDto } from './dtos';

@Controller('game')
@ApiTags('game')
@UseInterceptors(CacheInterceptor)
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('/:id')
  @ApiOkResponse({
    type: GameDto,
  })
  async getGame(@Param('id') id: string): Promise<GameDto> {
    const result = await this.gameService.getGame(id);
    return result;
  }
}
