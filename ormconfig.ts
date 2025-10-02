import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

const config = () => {
  const config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    retryAttempts: 2,
    retryDelay: 3000,
    autoLoadEntities: true,
    // synchronize: process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'stage' ? true : false,
    synchronize: false,
    logging: true,
  };

  return config;
};

export default config;
