import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import { PollExecutorService } from './poll-executor.service';
import { QueueService } from './queue.service';

@Injectable()
export class QueueWorkerService implements OnModuleInit, OnModuleDestroy {
  private worker?: Worker;
  private timer?: NodeJS.Timeout;

  constructor(
    private readonly executor: PollExecutorService,
    private readonly queueService: QueueService,
  ) {}

  onModuleInit() {
    const disabled = process.env.WORKER_DISABLED === '1';
    const isTest = process.env.JEST_WORKER_ID !== undefined;
    if (disabled || isTest) {
      return;
    }

    const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';
    this.worker = new Worker(
      'rss-poll',
      async (job) => {
        if (job.name !== 'poll-feed') {
          return;
        }
        const feedId = (job.data as { feedId?: string }).feedId;
        if (!feedId) {
          return;
        }
        await this.executor.run(feedId);
      },
      { connection: { url: redisUrl } },
    );

    const scheduleUser = process.env.WORKER_SCHEDULE_USER_ID;
    if (scheduleUser) {
      const intervalMinutes = Number(
        process.env.WORKER_SCHEDULE_INTERVAL_MINUTES ?? '30',
      );
      const intervalMs = Number(
        process.env.WORKER_TICK_MS ?? String(intervalMinutes * 60 * 1000),
      );

      this.timer = setInterval(() => {
        void this.queueService.scheduleDueForUser(scheduleUser, intervalMinutes);
      }, intervalMs);
    }
  }

  async onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.worker) {
      await this.worker.close();
    }
  }
}
