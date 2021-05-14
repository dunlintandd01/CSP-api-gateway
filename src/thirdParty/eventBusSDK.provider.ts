import { Logger } from '@nestjs/common';
import * as EventBusSDK from '@hk01-digital/eventbus-js-sdk';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('EventBusSDK');

export const eventBusSDKProviders = [
  {
    provide: 'EVENT_BUS_SDK',
    useFactory: async (configService: ConfigService): Promise<EventBusSDK> => {
      const sdk = new EventBusSDK(
        configService.get<string>('RMQ_URL'),
        configService.get<string>('EVENT_BUS_EXCHANGE_CREATE_MODE'),
      );

      logger.log('RMQ connection initializing...');
      sdk.connect();
      logger.log('RMQ connection established');

      return sdk;
    },
    inject: [ConfigService],
  },
];
