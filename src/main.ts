import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { SVCAppModule } from './svc.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from './middlewares/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // http server
  const config = new DocumentBuilder()
    .setTitle('CSP platform')
    .setDescription('The CSP platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.enableCors(); // TODO: whilelist

  await app.listen(process.env.PORT || 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

async function bootstrapMicroServices() {
  const app = await NestFactory.create(SVCAppModule);

  // TODO: credentials

  // NOTE: register and start microservices
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      protoPath: join(__dirname, '../proto/hero.proto'),
      url: 'localhost:50051',
    },
  });
  await app.startAllMicroservicesAsync();
}
bootstrapMicroServices();
