import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedsService } from './feeds.service';
import { FeedsModule } from './feeds.module';
import { sqliteTestConfig } from '../../database/typeorm-test';

describe('FeedsService', () => {
  let service: FeedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(sqliteTestConfig), FeedsModule],
    }).compile();

    service = module.get(FeedsService);
  });

  it('creates and lists feeds by user', async () => {
    await service.create({
      userId: 'u1',
      title: 'Feed A',
      url: 'https://a.test/rss',
    });

    await service.create({
      userId: 'u2',
      title: 'Feed B',
      url: 'https://b.test/rss',
    });

    const list = await service.list('u1');
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('Feed A');
  });

  it('updates and removes a feed scoped by user', async () => {
    const feed = await service.create({
      userId: 'u1',
      title: 'Old',
      url: 'https://old.test/rss',
    });

    const updated = await service.update(feed.id, 'u1', { title: 'New' });
    expect(updated?.title).toBe('New');

    expect(await service.update(feed.id, 'u2', { title: 'Hack' })).toBeNull();

    expect(await service.remove(feed.id, 'u2')).toBe(false);
    expect(await service.remove(feed.id, 'u1')).toBe(true);
    expect(await service.list('u1')).toHaveLength(0);
  });

  it('updates poll metadata on success and failure', async () => {
    const feed = await service.create({
      userId: 'u1',
      title: 'Poll Feed',
      url: 'https://poll.test/rss',
    });

    await service.markPollSuccess(feed.id);
    let afterSuccess = await service.getById(feed.id);
    expect(afterSuccess?.lastPolledAt).toBeTruthy();
    expect(afterSuccess?.lastPollStatus).toBe('ok');

    await service.markPollFailure(feed.id);
    afterSuccess = await service.getById(feed.id);
    expect(afterSuccess?.lastPollStatus).toBe('failed');
    expect(afterSuccess?.pollFailureCount).toBe(1);
  });

  it('returns due feeds by interval', async () => {
    const dueNeverPolled = await service.create({
      userId: 'u1',
      title: 'Due Never',
      url: 'https://due-never.test/rss',
    });
    const fresh = await service.create({
      userId: 'u1',
      title: 'Fresh',
      url: 'https://fresh.test/rss',
    });

    await service.markPollSuccess(fresh.id);

    const due = await service.listDueForUser(
      'u1',
      60,
      new Date('2999-01-01T02:00:00.000Z'),
    );
    expect(due.map((item) => item.id)).toContain(dueNeverPolled.id);
  });
});
