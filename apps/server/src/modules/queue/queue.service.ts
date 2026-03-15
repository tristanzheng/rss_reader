import { NotFoundException, Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { FeedsService } from '../feeds/feeds.service';

export interface PollFeedJob {
  feedId: string;
}

@Injectable()
export class QueueService {
  constructor(
    @Inject('RSS_POLL_QUEUE')
    private readonly pollQueue: Queue<PollFeedJob>,
    private readonly feedsService: FeedsService,
  ) {}

  enqueueFeedPoll(feedId: string) {
    return this.pollQueue.add('poll-feed', { feedId }, { attempts: 3 });
  }

  async enqueueFeedPollForUser(userId: string, feedId: string) {
    const feed = await this.feedsService.getByIdForUser(feedId, userId);
    if (!feed) {
      throw new NotFoundException('Feed not found');
    }

    return this.enqueueFeedPoll(feedId);
  }

  async scheduleAllForUser(userId: string): Promise<{ queued: number }> {
    const feeds = await this.feedsService.list(userId);
    for (const feed of feeds) {
      await this.enqueueFeedPoll(feed.id);
    }

    return { queued: feeds.length };
  }

  async scheduleDueForUser(
    userId: string,
    intervalMinutes: number,
  ): Promise<{ queued: number }> {
    const safeInterval = Number.isFinite(intervalMinutes) && intervalMinutes > 0 ? intervalMinutes : 30;
    const feeds = await this.feedsService.listDueForUser(
      userId,
      safeInterval,
      new Date(),
    );
    for (const feed of feeds) {
      await this.enqueueFeedPoll(feed.id);
    }

    return { queued: feeds.length };
  }

  async health() {
    const waiting = await this.pollQueue.getWaitingCount();
    const delayed = await this.pollQueue.getDelayedCount();
    return { queue: 'rss-poll', waiting, delayed };
  }
}
