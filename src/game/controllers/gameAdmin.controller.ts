import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger'

import { AdminAuthGuard } from '../../auth/guards/admin.guard'

import { GameService } from '../game.service'
import { SaveGameReq, GetGameListReq } from '../dtos'
import { Game } from '../entities'

@Controller('admin/game')
@ApiTags('game')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('admin')
export class GameAdminController {
  constructor(private gameService: GameService) {}

  @Get('/')
  @ApiOkResponse({
    type: Game,
    isArray: true,
  })
  async getGameList(@Query() query: GetGameListReq): Promise<Game[]> {
    const result = await this.gameService.getGameList(
      query.search,
      query.page,
      query.pageSize,
    )
    return result
  }

  @Get('/:id')
  @ApiOkResponse({
    type: Game,
  })
  async getGame(@Param('id') id: number): Promise<Game> {
    const result = await this.gameService.getGame(id)
    console.log(result)
    if (!result) {
      throw new HttpException('game not found', HttpStatus.NOT_FOUND)
    }
    return result
  }

  @Post('/')
  @ApiOkResponse({
    type: Game,
  })
  async createGame(@Body() body: SaveGameReq, @Request() req): Promise<Game> {
    const result = await this.gameService.createGame(body, req.user.username)
    return result
  }

  @Put('/:id')
  @ApiOkResponse({
    type: Game,
  })
  async updateGame(
    @Param('id') id: number,
    @Body() body: SaveGameReq,
  ): Promise<void> {
    await this.gameService.updateGame(id, body)
    return
  }

  @Delete('/:id')
  @ApiOkResponse({
    type: Game,
  })
  async deleteGame(@Param('id') id: number): Promise<void> {
    await this.gameService.deleteGame(id)
    return
  }
}
