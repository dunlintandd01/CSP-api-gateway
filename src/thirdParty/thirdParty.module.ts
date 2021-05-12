import { Module, DynamicModule, Logger } from '@nestjs/common';
import { PointsService } from './services/points.service';
import * as sdk from './services/eventbusSDK.service';

@Module({
  providers: [PointsService],
})
export class ThirdPartyModule {
  static forRoot(): DynamicModule {
    const logger = new Logger(ThirdPartyModule.name);
    sdk
      .init()
      .then(() => {
        logger.log('eventbus initialization succeeded');
      })
      .catch((error) => {
        logger.error('eventbus initialization failed', error.stack);
      });
    return {
      module: ThirdPartyModule,
      providers: [PointsService],
      exports: [PointsService],
    };
  }
}
