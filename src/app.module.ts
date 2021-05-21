import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import configuration from './config/configuration'
import { HealthModule } from './health/health.module'
import { AuthModule } from './auth/auth.module'
import { RedisModule } from './redis/redis.module'

// import { HeroModule } from './hero/hero.module';
import { GameModule } from './game/game.module'

@Module({
  imports: [
    HealthModule,
    // TODO: add validation
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST'),
        port: Number(configService.get<string>('REDIS_PORT')),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    // HeroModule,
    GameModule,
  ],
})
export class AppModule {}
