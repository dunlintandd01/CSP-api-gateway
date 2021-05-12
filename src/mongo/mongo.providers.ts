import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
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
];
