import { Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as IORedis from 'ioredis';

export const databaseProviders = [
  {
    provide: 'MONGO_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      return mongoose.connect(process.env.MONGO_URL, {
        dbName: process.env.MONGO_DATABASE,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    },
  },
  {
    provide: 'REDIS_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      const client = new IORedis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      });
      client.on('error', (err) => {
        new Logger('REDIS_CONNECTION_PROVIDER').error(err);
        client.quit();
      });
      return client;
    },
  },
];
