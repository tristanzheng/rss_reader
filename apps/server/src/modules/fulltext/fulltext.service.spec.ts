import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntryEntity, FeedEntity } from '../../database/entities';
import { sqliteTestConfig } from '../../database/typeorm-test';
import { ensureFeed } from '../../database/test-seed';
import { FulltextModule } from './fulltext.module';
import { FulltextService } from './fulltext.service';

describe('FulltextService', () => {
  let service: FulltextService;
  let entries: Repository<EntryEntity>;
  let feeds: Repository<FeedEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(sqliteTestConfig),
        TypeOrmModule.forFeature([FeedEntity]),
        FulltextModule,
      ],
    }).compile();

    service = module.get(FulltextService);
    entries = module.get(getRepositoryToken(EntryEntity));
    feeds = module.get(getRepositoryToken(FeedEntity));

    await ensureFeed(feeds, 'f1');

    await entries.save(
      entries.create({
        feedId: 'f1',
        title: 'A',
        url: 'https://a.test',
        guid: null,
        content: 'Body A',
        fulltext: null,
        publishedAt: new Date('2026-03-01T00:00:00.000Z'),
      }),
    );
  });

  it('fetches and stores fulltext', async () => {
    const row = await entries.find();
    const id = row[0].id;

    const result = await service.fetch(id);

    expect(result.entryId).toBe(id);
    expect(result.fulltext).toContain('Body A');

    const updated = await entries.findOneByOrFail({ id });
    expect(updated.fulltext).toContain('Body A');
  });
});
