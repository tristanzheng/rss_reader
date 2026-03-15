import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { entities } from './entities';

const dbType = (process.env.DB_TYPE as 'postgres' | 'sqlite') ?? 'sqlite';

const baseOptions: DataSourceOptions =
  dbType === 'sqlite'
    ? {
        type: 'sqlite',
        database: process.env.DB_NAME ?? ':memory:',
      }
    : {
        type: 'postgres',
        url: process.env.DATABASE_URL,
      };

export const typeOrmOptions: TypeOrmModuleOptions = {
  ...baseOptions,
  synchronize: false,
  entities,
  migrations: ['dist/database/migrations/*.js'],
  autoLoadEntities: true,
};
