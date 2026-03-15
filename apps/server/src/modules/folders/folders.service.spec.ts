import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoldersModule } from './folders.module';
import { FoldersService } from './folders.service';
import { sqliteTestConfig } from '../../database/typeorm-test';

describe('FoldersService', () => {
  let service: FoldersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(sqliteTestConfig), FoldersModule],
    }).compile();

    service = module.get(FoldersService);
  });

  it('creates and lists folders by user', async () => {
    await service.create({ userId: 'u1', name: 'Tech' });
    await service.create({ userId: 'u2', name: 'News' });

    const list = await service.list('u1');
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Tech');
  });

  it('updates and removes folder scoped by user', async () => {
    const folder = await service.create({ userId: 'u1', name: 'Old' });
    const updated = await service.update(folder.id, 'u1', { name: 'New' });

    expect(updated?.name).toBe('New');
    expect(await service.update(folder.id, 'u2', { name: 'Hack' })).toBeNull();

    expect(await service.remove(folder.id, 'u2')).toBe(false);
    expect(await service.remove(folder.id, 'u1')).toBe(true);
  });
});
