import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { GameService } from '../services/game.service'
import { Game } from '../entities'

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private gameService: GameService) {}

  // @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({
    type: Game,
  })
  @Get('/:code')
  async getGame(@Param('code') code: string): Promise<Game> {
    const result = await this.gameService.getGameWithCache(code)
    if (!result) {
      throw new HttpException('Game Not Found', HttpStatus.NOT_FOUND)
    }
    return result
  }
}
