import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from './../src/app.module';
import { FeedEntity } from './../src/database/entities';
import { ensureFeed } from './../src/database/test-seed';
import { FeedsService } from './../src/modules/feeds/feeds.service';
import { EntriesService } from './../src/modules/entries/entries.service';
import { FetcherService } from './../src/modules/fetcher/fetcher.service';
import { sqliteTestConfig } from './../src/database/typeorm-test';

describe('RSS Modules (integration)', () => {
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(sqliteTestConfig),
        TypeOrmModule.forFeature([FeedEntity]),
        AppModule,
      ],
    }).compile();
  });

  it('creates feed and lists feeds', async () => {
    const feeds = moduleFixture.get(FeedsService);
    await feeds.create({ userId: 'u1', title: 'Feed A', url: 'https://a.test/rss' });

    const result = await feeds.list('u1');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Feed A');
  });

  it('ingests entries and toggles read/save states', async () => {
    const fetcher = moduleFixture.get(FetcherService);
    const entries = moduleFixture.get(EntriesService);
    const feeds = moduleFixture.get<Repository<FeedEntity>>(
      getRepositoryToken(FeedEntity),
    );

    await ensureFeed(feeds, 'f1', 'u1');

    await fetcher.ingest([
      {
        feedId: 'f1',
        title: 'Entry A',
        url: 'https://a.test/1',
        guid: 'g1',
        content: 'content',
        publishedAt: '2026-03-01T00:00:00.000Z',
      },
    ]);

    const list = await entries.list('u1', {});
    const id = list.items[0].id;

    await entries.markRead('u1', id);
    await entries.save('u1', id);

    const filtered = await entries.list('u1', { read: 'true', saved: 'true' });
    expect(filtered.items).toHaveLength(1);
  });
});
