import { DataSource, DataSourceOptions } from 'typeorm';
import { entities } from './entities';

const dbType = (process.env.DB_TYPE as 'postgres' | 'sqlite') ?? 'sqlite';

const options: DataSourceOptions =
  dbType === 'sqlite'
    ? {
        type: 'sqlite',
        database: process.env.DB_NAME ?? ':memory:',
      }
    : {
        type: 'postgres',
        url: process.env.DATABASE_URL,
      };

export default new DataSource({
  ...options,
  entities,
  migrations: ['src/database/migrations/*.ts'],
});
