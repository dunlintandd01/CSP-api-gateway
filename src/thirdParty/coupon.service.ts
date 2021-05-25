import { HttpService, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import jwt from 'jsonwebtoken'

@Injectable()
export class CouponService {
  payload: Record<string, string>
  opotions: Record<string, string>
  secret: string
  jwtToken: string

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.payload = {
      clientId: this.configService.get<string>('COUPON_REDEEM_CLIENT_ID'),
    }
    this.secret = this.configService.get<string>('COUPON_REDEEM_SECRET')
    this.opotions = {
      algorithm: this.configService.get<string>('COUPON_REDEEM_ALGORITHM'),
      expiresIn: this.configService.get<string>('COUPON_REDEEM_EXPIRES_IN'),
    }
    this.jwtToken = jwt.sign(this.payload, this.secret, this.opotions)
  }

  async redeemCoupon(
    skuId: string,
    userAccountId: string,
  ): Promise<Record<string, string>> {
    try {
      const url = this.configService
        .get<string>('COUPON_REDEEM_URL')
        .replace('{skuId}', skuId)
      const params = { userAccountId: userAccountId }
      const result = await this.httpService
        .post(url, params, {
          headers: {
            'HK01-Auth-Schema': 'API',
            Authorization: `Bearer ${this.jwtToken}`,
          },
          timeout: 10000,
        })
        .toPromise()
      return result.data
    } catch (error) {
      //TODO: integrate error
      throw new Error('coupon error')
    }
  }
}
