import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AdminStrategy } from './strategies/admin.strategy';
import { MemberStrategy } from './strategies/member.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SSO_SECRET'),
        signOptions: {
          expiresIn: '12h',
          algorithm: 'HS256',
          // issuer: 'hk01-project',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AdminStrategy, MemberStrategy, AuthService],
})
export class AuthModule {}
