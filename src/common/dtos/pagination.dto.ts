import { IsInt, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class Pagination {
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  pageSize?: number
}
