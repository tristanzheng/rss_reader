import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntryEntity, FetchFailureEntity } from '../../database/entities';

export interface ParsedFeedEntry {
  feedId: string;
  title: string;
  url: string;
  guid?: string;
  content: string;
  publishedAt: string;
}

@Injectable()
export class FetcherService {
  constructor(
    @InjectRepository(EntryEntity)
    private readonly entries: Repository<EntryEntity>,
    @InjectRepository(FetchFailureEntity)
    private readonly failures: Repository<FetchFailureEntity>,
  ) {}

  async ingest(parsed: ParsedFeedEntry[]): Promise<{ inserted: number; skipped: number }> {
    let inserted = 0;
    let skipped = 0;

    for (const item of parsed) {
      const hash = createHash('sha256').update(item.content).digest('hex');
      const sameGuid = item.guid
        ? await this.entries.findOne({ where: { guid: item.guid } })
        : null;
      const sameUrl = await this.entries.findOne({ where: { url: item.url } });

      let sameHash = false;
      if (!sameGuid && !sameUrl) {
        const all = await this.entries.find();
        sameHash = all.some((entry) => {
          const existingHash = createHash('sha256').update(entry.content).digest('hex');
          return existingHash === hash;
        });
      }

      if (sameGuid || sameUrl || sameHash) {
        skipped += 1;
        continue;
      }

      const entry = this.entries.create({
        feedId: item.feedId,
        title: item.title,
        url: item.url,
        guid: item.guid ?? null,
        content: item.content,
        fulltext: null,
        publishedAt: new Date(item.publishedAt),
      });
      await this.entries.save(entry);
      inserted += 1;
    }

    return { inserted, skipped };
  }

  async recordFailure(feedId: string): Promise<number> {
    let failure = await this.failures.findOne({ where: { feedId } });
    if (!failure) {
      failure = this.failures.create({ feedId, failCount: 0 });
    }

    failure.failCount += 1;
    await this.failures.save(failure);
    return failure.failCount;
  }
}
