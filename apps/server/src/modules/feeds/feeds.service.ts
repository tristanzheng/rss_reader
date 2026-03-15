import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedEntity } from '../../database/entities';

export interface CreateFeedDto {
  userId: string;
  folderId?: string | null;
  title: string;
  url: string;
}

export interface UpdateFeedDto {
  folderId?: string | null;
  title?: string;
  url?: string;
}

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(FeedEntity)
    private readonly repository: Repository<FeedEntity>,
  ) {}

  list(userId: string): Promise<FeedEntity[]> {
    return this.repository.find({
      where: { userId },
      order: { title: 'ASC' },
    });
  }

  async listDueForUser(
    userId: string,
    intervalMinutes: number,
    now = new Date(),
  ): Promise<FeedEntity[]> {
    const feeds = await this.list(userId);
    return feeds.filter((feed) => {
      if (!feed.lastPolledAt) {
        return true;
      }
      const dueAt =
        feed.lastPolledAt.getTime() + intervalMinutes * 60 * 1000;
      return dueAt <= now.getTime();
    });
  }

  getById(id: string): Promise<FeedEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  getByIdForUser(id: string, userId: string): Promise<FeedEntity | null> {
    return this.repository.findOne({ where: { id, userId } });
  }

  create(payload: CreateFeedDto): Promise<FeedEntity> {
    const feed = this.repository.create({
      userId: payload.userId,
      folderId: payload.folderId ?? null,
      title: payload.title,
      url: payload.url,
      lastPolledAt: null,
      lastPollStatus: null,
      pollFailureCount: 0,
    });
    return this.repository.save(feed);
  }

  async update(
    id: string,
    userId: string,
    payload: UpdateFeedDto,
  ): Promise<FeedEntity | null> {
    const feed = await this.getByIdForUser(id, userId);
    if (!feed) {
      return null;
    }

    feed.folderId = payload.folderId ?? feed.folderId;
    feed.title = payload.title ?? feed.title;
    feed.url = payload.url ?? feed.url;
    return this.repository.save(feed);
  }

  async markPollSuccess(id: string): Promise<void> {
    const feed = await this.repository.findOne({ where: { id } });
    if (!feed) {
      return;
    }

    feed.lastPolledAt = new Date();
    feed.lastPollStatus = 'ok';
    feed.pollFailureCount = 0;
    await this.repository.save(feed);
  }

  async markPollFailure(id: string): Promise<void> {
    const feed = await this.repository.findOne({ where: { id } });
    if (!feed) {
      return;
    }

    feed.lastPolledAt = new Date();
    feed.lastPollStatus = 'failed';
    feed.pollFailureCount += 1;
    await this.repository.save(feed);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const result = await this.repository.delete({ id, userId });
    return (result.affected ?? 0) > 0;
  }
}
