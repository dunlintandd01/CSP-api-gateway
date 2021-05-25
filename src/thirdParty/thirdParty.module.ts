import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PointsService } from './points.service'
import { EventBusSDKService } from './eventBusSDK.service'
import { eventBusSDKProviders } from './eventBusSDK.provider'
import { S3Service } from './s3.service'
import { CouponService } from './coupon.service'

@Module({
  imports: [ConfigModule],
  providers: [
    ...eventBusSDKProviders,
    PointsService,
    EventBusSDKService,
    S3Service,
  ],
  exports: [PointsService, S3Service, CouponService],
})
export class ThirdPartyModule {}
