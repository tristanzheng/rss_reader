import { Injectable } from '@nestjs/common';
import { FeedParserService } from '../fetcher/feed-parser.service';
import { FetcherService } from '../fetcher/fetcher.service';
import { FeedsService } from '../feeds/feeds.service';

@Injectable()
export class PollExecutorService {
  constructor(
    private readonly feedsService: FeedsService,
    private readonly feedParser: FeedParserService,
    private readonly fetcherService: FetcherService,
  ) {}

  async run(
    feedId: string,
  ): Promise<{ status: 'ok' | 'failed'; inserted?: number; skipped?: number; reason?: string }> {
    const feed = await this.feedsService.getById(feedId);
    if (!feed) {
      await this.fetcherService.recordFailure(feedId);
      return { status: 'failed', reason: 'feed_not_found' };
    }

    try {
      const parsed = await this.feedParser.parse(feed.id, feed.url);
      const result = await this.fetcherService.ingest(parsed);
      await this.feedsService.markPollSuccess(feedId);
      return { status: 'ok', inserted: result.inserted, skipped: result.skipped };
    } catch {
      await this.fetcherService.recordFailure(feedId);
      await this.feedsService.markPollFailure(feedId);
      return { status: 'failed', reason: 'parse_failed' };
    }
  }

  async runForUser(
    userId: string,
    feedId: string,
  ): Promise<{ status: 'ok' | 'failed'; inserted?: number; skipped?: number; reason?: string }> {
    const feed = await this.feedsService.getByIdForUser(feedId, userId);
    if (!feed) {
      return { status: 'failed', reason: 'forbidden_or_not_found' };
    }

    return this.run(feedId);
  }
}
