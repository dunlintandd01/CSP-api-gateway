import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from './core/core.module'
import { AuthModule } from './auth/auth.module'
import { CampaignModule } from './campaign/campaign.module'
import { GameModule } from './game/game.module'
import { PlayerModule } from './player/player.module'
import { QuizModule } from './quiz/quiz.module'

@Module({
  imports: [
    CoreModule,
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
        // synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CampaignModule,
    GameModule,
    PlayerModule,
    QuizModule,
  ],
})
export class AppModule {}
