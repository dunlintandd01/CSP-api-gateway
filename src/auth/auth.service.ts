import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async adminLogin(authCode: string, redirectUrl: string) {
    const oAuth2Client = new google.auth.OAuth2(
      this.configService.get<string>('SSO_GOOGLE_CILENTID'),
      this.configService.get<string>('SSO_GOOGLE_SECRET'),
      redirectUrl,
    );
    const tk = await oAuth2Client.getToken(authCode);
    const payload: any = this.jwtService.decode(tk.tokens.id_token);
    const newPayload = {
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
    };
    return this.jwtService.sign(newPayload);
  }
}
