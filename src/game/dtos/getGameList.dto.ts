import { IsString, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

import { Pagination } from '../../common/dtos/pagination.dto'

export class GetGameListReq extends Pagination {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string
}
