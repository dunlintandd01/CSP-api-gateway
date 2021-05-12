import * as EventbusSDK from '@hk01-digital/eventbus-js-sdk';

export const eventBusSDKProviders = [
  {
    provide: 'EVENT_BUS_SDK',
    useFactory: (): Promise<any> => {
      return new EventbusSDK(process.env.RMQ_URL, 'ASSERT').connect();
    },
  },
];
