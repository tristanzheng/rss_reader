import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { entities } from './entities';

export const sqliteTestConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities,
  dropSchema: true,
};
