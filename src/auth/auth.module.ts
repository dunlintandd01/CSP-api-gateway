import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AdminStrategy } from './strategies/admin.strategy';
import { MemberStrategy } from './strategies/member.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.SSO_SECRET,
      signOptions: {
        expiresIn: '12h',
        algorithm: 'HS256',
        issuer: 'hk01-project',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AdminStrategy, MemberStrategy, AuthService],
})
export class AuthModule {}
