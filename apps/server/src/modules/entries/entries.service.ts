import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntryEntity, EntryReadEntity, EntrySaveEntity } from '../../database/entities';

export interface EntryQuery {
  source?: string;
  read?: 'true' | 'false';
  saved?: 'true' | 'false';
  q?: string;
  from?: string;
  to?: string;
  page?: string;
  pageSize?: string;
}

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(EntryEntity)
    private readonly entries: Repository<EntryEntity>,
    @InjectRepository(EntryReadEntity)
    private readonly reads: Repository<EntryReadEntity>,
    @InjectRepository(EntrySaveEntity)
    private readonly saves: Repository<EntrySaveEntity>,
  ) {}

  async list(userId: string, query: EntryQuery) {
    const qb = this.entries.createQueryBuilder('entry');

    qb.innerJoin('entry.feed', 'feed', 'feed.userId = :userId', { userId });

    if (query.source) {
      qb.andWhere('entry.feedId = :source', { source: query.source });
    }

    const keyword = query.q?.trim();
    if (keyword) {
      const isPostgres = this.entries.manager.connection.options.type === 'postgres';
      if (isPostgres) {
        qb.andWhere(
          "to_tsvector('simple', coalesce(entry.title, '') || ' ' || coalesce(entry.content, '')) @@ plainto_tsquery('simple', :q)",
          { q: keyword },
        );
      } else {
        qb.andWhere('(LOWER(entry.title) LIKE :q OR LOWER(entry.content) LIKE :q)', {
          q: `%${keyword.toLowerCase()}%`,
        });
      }
    }

    if (query.from) {
      qb.andWhere('entry.publishedAt >= :from', { from: query.from });
    }

    if (query.to) {
      qb.andWhere('entry.publishedAt <= :to', { to: query.to });
    }

    const readRows = await this.reads.find({ where: { userId } });
    const saveRows = await this.saves.find({ where: { userId } });
    const readIds = readRows.map((item) => item.entryId);
    const saveIds = saveRows.map((item) => item.entryId);

    if (query.read === 'true') {
      if (readIds.length === 0) {
        return { page: 1, pageSize: 0, total: 0, items: [] };
      }
      qb.andWhere('entry.id IN (:...readIds)', { readIds });
    }

    if (query.read === 'false' && readIds.length > 0) {
      qb.andWhere('entry.id NOT IN (:...readIds)', { readIds });
    }

    if (query.saved === 'true') {
      if (saveIds.length === 0) {
        return { page: 1, pageSize: 0, total: 0, items: [] };
      }
      qb.andWhere('entry.id IN (:...saveIds)', { saveIds });
    }

    if (query.saved === 'false' && saveIds.length > 0) {
      qb.andWhere('entry.id NOT IN (:...saveIds)', { saveIds });
    }

    qb.orderBy('entry.publishedAt', 'DESC');

    const page = Number(query.page ?? '1');
    const pageSize = Number(query.pageSize ?? '20');
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    const readSet = new Set(readIds);
    const saveSet = new Set(saveIds);
    const enriched = items.map((item) => ({
      ...item,
      isRead: readSet.has(item.id),
      isSaved: saveSet.has(item.id),
    }));

    return { page, pageSize, total, items: enriched };
  }

  detail(id: string): Promise<EntryEntity | null> {
    return this.entries.findOne({ where: { id } });
  }

  async markRead(userId: string, entryId: string): Promise<void> {
    const exists = await this.reads.findOne({ where: { userId, entryId } });
    if (!exists) {
      await this.reads.save(this.reads.create({ userId, entryId }));
    }
  }

  async markUnread(userId: string, entryId: string): Promise<void> {
    await this.reads.delete({ userId, entryId });
  }

  async save(userId: string, entryId: string): Promise<void> {
    const exists = await this.saves.findOne({ where: { userId, entryId } });
    if (!exists) {
      await this.saves.save(this.saves.create({ userId, entryId }));
    }
  }

  async unsave(userId: string, entryId: string): Promise<void> {
    await this.saves.delete({ userId, entryId });
  }
}
