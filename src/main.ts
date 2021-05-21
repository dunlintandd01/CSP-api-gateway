import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as helmet from 'helmet'

import { AppModule } from './app.module'
import { ValidationPipe } from './core/middlewares/validation.pipe'
import { AllExceptionFilter } from './core/middlewares/exception.filter'
import { LoggingInterceptor } from './core/middlewares/logger.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // http server
  const config = new DocumentBuilder()
    .setTitle('CSP platform')
    .setDescription('The CSP platform API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http' }, 'admin')
    .addBearerAuth({ type: 'http' }, 'member')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new AllExceptionFilter())
  app.use(helmet())
  app.enableCors({ origin: '*' }) // TODO: whilelist

  const configService = app.get(ConfigService)
  await app.listen(configService.get('PORT'))

  new Logger('App').log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
