import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedEntity } from '../../database/entities';
import { sqliteTestConfig } from '../../database/typeorm-test';
import { ensureFeed } from '../../database/test-seed';
import { EntriesModule } from './entries.module';
import { EntriesService } from './entries.service';
import { FetcherModule } from '../fetcher/fetcher.module';
import { FetcherService } from '../fetcher/fetcher.service';

describe('EntriesService', () => {
  let service: EntriesService;
  let fetcher: FetcherService;
  let feeds: Repository<FeedEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(sqliteTestConfig),
        TypeOrmModule.forFeature([FeedEntity]),
        EntriesModule,
        FetcherModule,
      ],
    }).compile();

    service = module.get(EntriesService);
    fetcher = module.get(FetcherService);
    feeds = module.get(getRepositoryToken(FeedEntity));

    await ensureFeed(feeds, 'f1');
    await ensureFeed(feeds, 'f2');

    await fetcher.ingest([
      {
        feedId: 'f1',
        title: 'Alpha',
        url: 'https://a.test/1',
        guid: 'g1',
        content: 'hello alpha',
        publishedAt: '2026-03-01T00:00:00.000Z',
      },
      {
        feedId: 'f2',
        title: 'Beta',
        url: 'https://b.test/2',
        guid: 'g2',
        content: 'hello beta',
        publishedAt: '2026-03-02T00:00:00.000Z',
      },
    ]);
  });

  it('filters by source and keyword', async () => {
    const bySource = await service.list('u1', { source: 'f1' });
    expect(bySource.items).toHaveLength(1);

    const byQuery = await service.list('u1', { q: 'beta' });
    expect(byQuery.items).toHaveLength(1);
    expect(byQuery.items[0].title).toBe('Beta');
  });

  it('supports case-insensitive and trimmed keyword search', async () => {
    const byUpper = await service.list('u1', { q: '  ALPHA  ' });
    expect(byUpper.items).toHaveLength(1);
    expect(byUpper.items[0].title).toBe('Alpha');
  });

  it('marks read/save and filters by state', async () => {
    const all = await service.list('u1', {});
    const entryId = all.items[0].id;

    await service.markRead('u1', entryId);
    await service.save('u1', entryId);

    expect((await service.list('u1', { read: 'true' })).items).toHaveLength(1);
    expect((await service.list('u1', { saved: 'true' })).items).toHaveLength(1);

    await service.markUnread('u1', entryId);
    await service.unsave('u1', entryId);

    expect((await service.list('u1', { read: 'true' })).items).toHaveLength(0);
    expect((await service.list('u1', { saved: 'true' })).items).toHaveLength(0);
  });
});
