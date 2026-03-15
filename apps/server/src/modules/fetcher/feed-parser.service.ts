import { Injectable } from '@nestjs/common';
import Parser from 'rss-parser';
import type { ParsedFeedEntry } from './fetcher.service';

@Injectable()
export class FeedParserService {
  private readonly parser = new Parser();

  async parse(feedId: string, feedUrl: string): Promise<ParsedFeedEntry[]> {
    const parsed = await this.parser.parseURL(feedUrl);

    return (parsed.items ?? []).map((item, index) => ({
      feedId,
      title: item.title ?? `Untitled ${index + 1}`,
      url: item.link ?? `${feedUrl}#${index + 1}`,
      guid: item.guid ?? item.id ?? undefined,
      content:
        item.content ?? item.contentSnippet ?? item.summary ?? item.title ?? '',
      publishedAt: item.isoDate ?? new Date().toISOString(),
    }));
  }
}
