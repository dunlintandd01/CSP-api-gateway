import * as EventbusSDK from '@hk01-digital/eventbus-js-sdk';
import { ConfigService } from '@nestjs/config';

export const eventBusSDKProviders = [
  {
    provide: 'EVENT_BUS_SDK',
    useFactory: (configService: ConfigService): Promise<any> => {
      return new EventbusSDK(
        configService.get<string>('RMQ_URL'),
        'ASSERT',
      ).connect();
    },
    inject: [ConfigService],
  },
];
