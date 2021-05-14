import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class EventBusSDKService {
  constructor(
    private configService: ConfigService,
    @Inject('EVENT_BUS_SDK') private sdk: any, // TODO: type definition
  ) {}

  async publish(routingPath: any, envelope: any): Promise<any> {
    await this.sdk.publish({
      topic: routingPath,
      envelope: envelope,
      retry: {
        retries: this.configService.get<string>('EVENT_BUS_RETRY_TIME'),
        maxTimeout: this.configService.get<string>('EVENT_BUS_MAX_TIMEOUT'),
      },
    });
  }
}
