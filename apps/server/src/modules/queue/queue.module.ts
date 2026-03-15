import { Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import { FeedsModule } from '../feeds/feeds.module';
import { FetcherModule } from '../fetcher/fetcher.module';
import { QueueController } from './queue.controller';
import { PollExecutorService } from './poll-executor.service';
import { QueueService } from './queue.service';
import { QueueWorkerService } from './worker.service';

interface QueueLike {
  add: Queue['add'];
  getWaitingCount: Queue['getWaitingCount'];
  getDelayedCount: Queue['getDelayedCount'];
}

function createInMemoryQueue(): QueueLike {
  return {
    add: async (_name, _data, _opts) => ({ id: 'mock-job' } as never),
    getWaitingCount: async () => 0,
    getDelayedCount: async () => 0,
  };
}

@Module({
  imports: [FeedsModule, FetcherModule],
  controllers: [QueueController],
  providers: [
    {
      provide: 'RSS_POLL_QUEUE',
      useFactory: () => {
        const isTest = process.env.JEST_WORKER_ID !== undefined;
        const disabled = process.env.REDIS_DISABLED === '1';
        if (isTest || disabled) {
          return createInMemoryQueue();
        }

        const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';
        return new Queue('rss-poll', { connection: { url: redisUrl } });
      },
    },
    QueueService,
    PollExecutorService,
    QueueWorkerService,
  ],
  exports: [QueueService, PollExecutorService],
})
export class QueueModule {}
