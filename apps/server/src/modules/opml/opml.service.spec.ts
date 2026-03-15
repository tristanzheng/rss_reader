import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedsModule } from '../feeds/feeds.module';
import { FoldersModule } from '../folders/folders.module';
import { OpmlModule } from './opml.module';
import { OpmlService } from './opml.service';
import { sqliteTestConfig } from '../../database/typeorm-test';

describe('OpmlService', () => {
  let service: OpmlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(sqliteTestConfig),
        FeedsModule,
        FoldersModule,
        OpmlModule,
      ],
    }).compile();

    service = module.get(OpmlService);
  });

  it('imports feeds and skips duplicates', async () => {
    const text =
      '<?xml version="1.0"?><opml><body>' +
      '<outline text="Tech" title="Tech"/>' +
      '<outline text="Feed1" title="Feed1" xmlUrl="https://f1.test/rss"/>' +
      '<outline text="Feed1" title="Feed1" xmlUrl="https://f1.test/rss"/>' +
      '</body></opml>';

    const result = await service.import({ userId: 'u1', text });
    expect(result.importedCount).toBe(1);
    expect(result.skippedCount).toBe(1);
  });

  it('exports OPML containing user feeds', async () => {
    await service.import({
      userId: 'u1',
      text:
        '<?xml version="1.0"?><opml><body><outline text="FeedX" title="FeedX" xmlUrl="https://x.test/rss"/></body></opml>',
    });

    const xml = await service.export('u1');
    expect(xml).toContain('<opml');
    expect(xml).toContain('https://x.test/rss');
  });
});
