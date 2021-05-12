import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PointsService } from './points.service';
import { EventBusSDKService } from './eventbusSDK.service';
import { eventBusSDKProviders } from './eventBusSDK.provider';

@Module({
  imports: [ConfigModule],
  providers: [...eventBusSDKProviders, PointsService, EventBusSDKService],
  exports: [PointsService],
})
export class ThirdPartyModule {}
