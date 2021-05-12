import { Logger } from '@nestjs/common';
import EventbusSDK from '@hk01-digital/eventbus-js-sdk';
import config from '../../config';

const exchangeCreateMode = config.get('eventbus.exchageCreateMode');
const enabled = config.get('eventbus.enabled');
const rmqUrl = config.get('eventbus.rmqUrl');
const retryTimes = config.get('eventbus.retryTimes');
const maxTimeout = config.get('eventbus.maxTimeout');

let sdk: EventbusSDK;

const logger = new Logger('EventbusSDK');

if (enabled) {
  sdk = new EventbusSDK(rmqUrl, exchangeCreateMode);
}

export const init = async (): Promise<boolean> => {
  if (enabled) {
    try {
      logger.log('RMQ connection initializing...');

      await sdk.connect();

      logger.log('RMQ connection established');

      return true;
    } catch (err) {
      // auto re-connect by eventbus-js-sd
      logger.error('eventbus/sdk#int RMQ connection failed... reconnecting');
    }
  }
};

export const publish = async (
  routingPath: any,
  envelope: any,
): Promise<any> => {
  if (enabled) {
    try {
      if (!sdk.isConnected()) {
        await init();
      }

      await sdk.publish({
        topic: routingPath,
        envelope: envelope,
        retry: {
          retries: retryTimes,
          maxTimeout: maxTimeout,
        },
      });
    } catch (err) {}
  }
};
