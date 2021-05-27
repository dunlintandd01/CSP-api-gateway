import {
  Controller,
  Get,
  Param,
  CacheInterceptor,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { GameService } from '../game.service'
import { Game } from '../entities'

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private gameService: GameService) {}

  // @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({
    type: Game,
  })
  @Get('/:id')
  async getGame(@Param('id') id: number): Promise<Game> {
    const result = await this.gameService.getGameWithCache(id)
    if (!result) {
      throw new HttpException('Game Not Found', HttpStatus.NOT_FOUND)
    }
    return result
  }
}
