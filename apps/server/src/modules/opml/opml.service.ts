import { Injectable } from '@nestjs/common';
import { FeedEntity } from '../../database/entities';
import { FeedsService } from '../feeds/feeds.service';
import { FoldersService } from '../folders/folders.service';

export interface OpmlImportResult {
  importedCount: number;
  skippedCount: number;
  errors: string[];
}

interface ImportPayload {
  userId: string;
  text: string;
}

@Injectable()
export class OpmlService {
  constructor(
    private readonly feedsService: FeedsService,
    private readonly foldersService: FoldersService,
  ) {}

  async import(payload: ImportPayload): Promise<OpmlImportResult> {
    const outlineRegex = /<outline[^>]*>/g;
    const titleRegex = /title="([^"]+)"/;
    const textRegex = /text="([^"]+)"/;
    const xmlUrlRegex = /xmlUrl="([^"]+)"/;

    const outlines = payload.text.match(outlineRegex) ?? [];
    let importedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];
    let currentFolderId: string | null = null;

    const existing = await this.feedsService.list(payload.userId);
    const existingUrls = new Set(existing.map((feed) => feed.url));

    for (const node of outlines) {
      const xmlMatch = node.match(xmlUrlRegex);
      const name = node.match(titleRegex)?.[1] ?? node.match(textRegex)?.[1] ?? '';

      if (!xmlMatch) {
        if (name) {
          const folder = await this.foldersService.create({
            userId: payload.userId,
            name,
          });
          currentFolderId = folder.id;
        }
        continue;
      }

      const url = xmlMatch[1];
      if (existingUrls.has(url)) {
        skippedCount += 1;
        continue;
      }

      if (!name) {
        errors.push(`Feed url ${url} missing title/text`);
      }

      await this.feedsService.create({
        userId: payload.userId,
        folderId: currentFolderId,
        title: name || url,
        url,
      });
      existingUrls.add(url);
      importedCount += 1;
    }

    return {
      importedCount,
      skippedCount,
      errors,
    };
  }

  async export(userId: string): Promise<string> {
    const feeds: FeedEntity[] = await this.feedsService.list(userId);
    const outlines = feeds
      .map(
        (feed) =>
          `<outline text="${feed.title}" title="${feed.title}" type="rss" xmlUrl="${feed.url}"/>`,
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?><opml version="2.0"><body>${outlines}</body></opml>`;
  }
}
