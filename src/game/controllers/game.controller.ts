import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { GameService } from '../game.service';
import { GameDto } from '../dtos';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @ApiOkResponse({
    type: GameDto,
  })
  @Get('/:id')
  async getGame(@Param('id') id: string): Promise<GameDto> {
    const result = await this.gameService.getGame(id);
    return result;
  }
}
