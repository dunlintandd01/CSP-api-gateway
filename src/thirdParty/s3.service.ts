import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as AWS from 'aws-sdk'
import * as R from 'ramda'
import path from 'path'
import uuid from 'uuid/v4'

@Injectable()
export class S3Service {
  s3: AWS.S3.Types
  s3Setting: Record<string, string>

  constructor(private configService: ConfigService) {
    AWS.config.update({
      accessKeyId: this.configService.get<string>('S3_CLIENT_KEY'),
      secretAccessKey: this.configService.get<string>('S3_CLIENT_SECRET'),
      region: this.configService.get<string>('S3_REGION'),
    })
    this.s3 = new AWS.S3()
    this.s3Setting = Object.freeze({
      Bucket: this.configService.get<string>('S3_BUCKET'),
    })
  }

  private getS3Param(key: string, options: Record<string, string> = {}): any {
    return R.merge(R.clone(this.s3Setting), {
      Key: key,
      ...options,
    })
  }

  async upload(body: string, key: string): Promise<string> {
    const params = this.getS3Param(key, { Body: body })
    try {
      const uploaded = await this.s3.upload(params).promise()
      return uploaded.Location
    } catch (error) {
      //TODO: integrate error
      throw new Error('s3 error')
    }
  }

  async delete(key: string): Promise<boolean> {
    await this.getObjectHead(key)
    const params = this.getS3Param(key)
    try {
      await this.s3.deleteObject(params).promise()
      return true
    } catch (error) {
      //TODO: integrate error
      throw new Error('s3 error')
    }
  }

  async move(key: string, newKey: string): Promise<boolean> {
    await this.getObjectHead(key)
    const params = this.getS3Param(newKey, {
      CopySource: `${this.configService.get<string>('S3_BUCKET')}/${key}`,
    })
    try {
      await this.s3.copyObject(params).promise()
      return await this.delete(key)
    } catch (error) {
      //TODO: integrate error
      throw new Error('s3 error')
    }
  }

  async get(key: string): Promise<AWS.S3.Types.GetObjectAclOutput> {
    await this.getObjectHead(key)
    const params = this.getS3Param(key)
    try {
      return this.s3.getObject(params).promise()
    } catch (error) {
      //TODO: integrate error
      throw new Error('s3 error')
    }
  }

  genKeyByFilename(filename: string): string {
    const ext = path.extname(filename)
    let key = uuid() + ext
    const folder1 = key.substr(0, 1)
    const folder2 = key.substr(1, 1)
    key = `${folder1}/${folder2}/${key}`
    return key
  }

  async getObjectHead(key: string): Promise<AWS.S3.Types.HeadObjectOutput> {
    const params = this.getS3Param(key)
    try {
      return this.s3.headObject(params).promise()
    } catch (error) {
      //TODO: integrate error
      throw new Error('s3 error')
    }
  }
}
