import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';
import { SVCAppModule } from './svc.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from './middlewares/validation.pipe';
import * as sdk from './thirdParty/services/eventbusSDK.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // http server
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
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

  /*-- eventbus --*/
  sdk
    .init()
    .then(() => {
      console.info('eventbus initialization succeeded');
    })
    .catch((error) => {
      console.error('eventbus initialization failed', error.stack);
    });
}
bootstrapMicroServices();
