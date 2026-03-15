import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntryEntity } from '../../database/entities';

@Injectable()
export class FulltextService {
  constructor(
    @InjectRepository(EntryEntity)
    private readonly entries: Repository<EntryEntity>,
  ) {}

  async fetch(entryId: string): Promise<{ entryId: string; fulltext: string }> {
    const entry = await this.entries.findOne({ where: { id: entryId } });
    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    const fulltext = `${entry.title}\n${entry.content}`;
    entry.fulltext = fulltext;
    await this.entries.save(entry);

    return { entryId, fulltext };
  }
}
