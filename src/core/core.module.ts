import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { RedisModule } from './redis/redis.module'
import configuration from './config/configuration'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    HealthModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST'),
        port: Number(configService.get<string>('REDIS_PORT')),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CoreModule {}
