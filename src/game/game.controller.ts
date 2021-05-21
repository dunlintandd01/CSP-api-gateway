import {
  Controller,
  Get,
  Param,
  CacheInterceptor,
  UseInterceptors,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { GameService } from './game.service'
import { GameDto } from './dtos'

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({
    type: GameDto,
  })
  @Get('/:id')
  async getGame(@Param('id', ParseIntPipe) id: number): Promise<GameDto> {
    const result = await this.gameService.getGameWithCache(id)
    if (!result) {
      throw new HttpException('Game Not Found', HttpStatus.NOT_FOUND)
    }
    return result
  }
}
