import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { GameService } from './game.service';
import { CreateGameReq, GameDto } from './dtos';

@Controller('game')
@ApiTags('game')
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

  @Post('/')
  @ApiOkResponse({
    type: GameDto,
  })
  async createGame(@Body() body: CreateGameReq): Promise<GameDto> {
    const { name } = body;
    const result = await this.gameService.createGame(name);
    return result;
  }
}
