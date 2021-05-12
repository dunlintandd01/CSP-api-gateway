import { Controller, Post, Body, Response } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AdminLoginRequestDto } from './dto/adminLogin.dto';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('adminLogin')
  async adminLogin(@Body() body: AdminLoginRequestDto, @Response() res: any) {
    const adminToken = await this.authService.adminLogin(
      body.authCode,
      body.redirectUrl,
    );
    res.set('Authorization', `Bearer ${adminToken}`);
    return {};
  }
}
