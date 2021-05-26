import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'

import { S3Service } from './s3.service'
jest.mock('./s3.service')

describe('S3 Service', () => {
  let s3Service: S3Service

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [S3Service, ConfigService],
    }).compile()
    s3Service = moduleRef.get<S3Service>(S3Service)
  })

  it('call upload', async () => {
    await s3Service.upload('testBody', 'testKey')
  })

  it('call delete', async () => {
    await s3Service.delete('testKey')
  })

  it('call move', async () => {
    await s3Service.move('testKey', 'testNewKey')
  })

  it('call get', async () => {
    await s3Service.get('testKey')
  })
})
