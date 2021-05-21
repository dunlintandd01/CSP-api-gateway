import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger'

import { AdminAuthGuard } from '../auth/guards/admin.guard'

import { GameService } from './game.service'
import { CreateGameReq, GameDto } from './dtos'
import { Game } from './entities'

@Controller('admin/game')
@ApiTags('game')
// @UseGuards(AdminAuthGuard)
@ApiBearerAuth('admin')
export class GameAdminController {
  constructor(private gameService: GameService) {}

  @Get('/:id')
  @ApiOkResponse({
    type: GameDto,
  })
  async getGame(@Param('id') id: number): Promise<GameDto> {
    const result = await this.gameService.getGame(id)
    return result
  }

  @Post('/')
  @ApiOkResponse({
    type: GameDto,
  })
  async createGame(@Body() body: CreateGameReq): Promise<GameDto> {
    const { name } = body
    const result = await this.gameService.createGame(name)
    return result
  }

  @Put('/:id')
  @ApiOkResponse({
    type: GameDto,
  })
  async updateGame(
    @Param('id') id: number,
    @Body() body: CreateGameReq,
  ): Promise<void> {
    await this.gameService.updateGame(id, body as Game)
    return
  }

  @Delete('/:id')
  @ApiOkResponse({
    type: GameDto,
  })
  async deleteGame(@Param('id') id: number): Promise<void> {
    await this.gameService.deleteGame(id)
    return
  }
}
