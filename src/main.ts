import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';
import { ValidationPipe } from './middlewares/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'hero', // ['hero', 'hero2']
      protoPath: join(__dirname, '../proto/hero.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
    },
  });
  await app.startAllMicroservicesAsync();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
