import { OmitType } from '@nestjs/swagger'
import { Game } from '../entities/game.entity'

export class SaveGameReq extends OmitType(Game, ['id'] as const) {}
