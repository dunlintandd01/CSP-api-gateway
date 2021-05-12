import { Module, DynamicModule } from '@nestjs/common';
import { PointsService } from './services/points.service';
import * as sdk from './services/eventbusSDK.service';

@Module({
  providers: [PointsService],
})
export class ThirdPartyModule {
  static forRoot(): DynamicModule {
    sdk
      .init()
      .then(() => {
        console.info('eventbus initialization succeeded');
      })
      .catch((error) => {
        console.error('eventbus initialization failed', error.stack);
      });
    return {
      module: ThirdPartyModule,
      providers: [PointsService],
      exports: [PointsService],
    };
  }
}
