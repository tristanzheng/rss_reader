import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedEntity, FetchFailureEntity } from '../../database/entities';
import { sqliteTestConfig } from '../../database/typeorm-test';
import { ensureFeed } from '../../database/test-seed';
import { FetcherModule } from './fetcher.module';
import { FetcherService } from './fetcher.service';

describe('FetcherService', () => {
  let service: FetcherService;
  let failures: Repository<FetchFailureEntity>;
  let feeds: Repository<FeedEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(sqliteTestConfig),
        TypeOrmModule.forFeature([FeedEntity]),
        FetcherModule,
      ],
    }).compile();

    service = module.get(FetcherService);
    failures = module.get(getRepositoryToken(FetchFailureEntity));
    feeds = module.get(getRepositoryToken(FeedEntity));

    await ensureFeed(feeds, 'f1');
  });

  it('ingests new entries and skips duplicates by guid/url/hash', async () => {
    const result1 = await service.ingest([
      {
        feedId: 'f1',
        title: 'A',
        url: 'https://x.test/a',
        guid: 'g-a',
        content: 'same-body',
        publishedAt: '2026-03-01T00:00:00.000Z',
      },
    ]);
    expect(result1.inserted).toBe(1);

    const result2 = await service.ingest([
      {
        feedId: 'f1',
        title: 'A2',
        url: 'https://x.test/a',
        guid: 'g-a2',
        content: 'different',
        publishedAt: '2026-03-01T00:00:00.000Z',
      },
      {
        feedId: 'f1',
        title: 'A3',
        url: 'https://x.test/new',
        guid: 'g-a3',
        content: 'same-body',
        publishedAt: '2026-03-01T00:00:00.000Z',
      },
    ]);

    expect(result2.skipped).toBe(2);
  });

  it('increments failure counter per feed', async () => {
    expect(await service.recordFailure('f1')).toBe(1);
    expect(await service.recordFailure('f1')).toBe(2);

    const row = await failures.findOneByOrFail({ feedId: 'f1' });
    expect(row.failCount).toBe(2);
  });
});
