import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AdminAuthGuard } from '../auth/guards/admin.guard';

import { GameService } from './game.service';
import { CreateGameReq, GameDto } from './dtos';

@Controller('admin/game')
@ApiTags('game')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('admin')
export class GameAdminController {
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
