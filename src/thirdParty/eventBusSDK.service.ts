import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class EventBusSDKService {
  constructor(
    private configService: ConfigService,
    @Inject('EVENT_BUS_SDK') private sdk: any, // TODO: type definition
  ) {}

  async publish(routingPath: any, envelope: any): Promise<any> {
    const { retryTimes, maxTimeout } = this.configService.get('eventbus');
    await this.sdk.publish({
      topic: routingPath,
      envelope: envelope,
      retry: {
        retries: retryTimes,
        maxTimeout: maxTimeout,
      },
    });
  }
}
