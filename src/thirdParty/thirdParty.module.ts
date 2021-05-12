import { Module } from '@nestjs/common';
import { PointsService } from './services/points.service';

@Module({
  providers: [PointsService],
})
export class ThirdPartyModule {}
