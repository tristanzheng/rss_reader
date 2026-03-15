import { NotFoundException } from '@nestjs/common';
import { QueueService } from './queue.service';

describe('QueueService', () => {
  it('enqueues poll job with attempts', async () => {
    const add = jest.fn().mockResolvedValue({ id: 'job-1' });
    const fakeQueue = {
      add,
      getWaitingCount: jest.fn().mockResolvedValue(1),
      getDelayedCount: jest.fn().mockResolvedValue(0),
    };
    const feeds = { list: jest.fn(), listDueForUser: jest.fn(), getByIdForUser: jest.fn() };

    const service = new QueueService(fakeQueue as never, feeds as never);
    await service.enqueueFeedPoll('feed-1');

    expect(add).toHaveBeenCalledWith(
      'poll-feed',
      { feedId: 'feed-1' },
      { attempts: 3 },
    );
  });

  it('enqueues only if feed belongs to user', async () => {
    const add = jest.fn().mockResolvedValue({ id: 'job-1' });
    const fakeQueue = {
      add,
      getWaitingCount: jest.fn().mockResolvedValue(1),
      getDelayedCount: jest.fn().mockResolvedValue(0),
    };
    const feeds = {
      list: jest.fn(),
      listDueForUser: jest.fn(),
      getByIdForUser: jest.fn().mockResolvedValue({ id: 'f1', userId: 'u1' }),
    };

    const service = new QueueService(fakeQueue as never, feeds as never);
    await service.enqueueFeedPollForUser('u1', 'f1');

    expect(add).toHaveBeenCalledTimes(1);
  });

  it('throws when feed does not belong to user', async () => {
    const fakeQueue = {
      add: jest.fn(),
      getWaitingCount: jest.fn().mockResolvedValue(1),
      getDelayedCount: jest.fn().mockResolvedValue(0),
    };
    const feeds = {
      list: jest.fn(),
      listDueForUser: jest.fn(),
      getByIdForUser: jest.fn().mockResolvedValue(null),
    };

    const service = new QueueService(fakeQueue as never, feeds as never);
    await expect(service.enqueueFeedPollForUser('u1', 'missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('schedules all feeds for a user', async () => {
    const add = jest.fn().mockResolvedValue({ id: 'job-1' });
    const fakeQueue = {
      add,
      getWaitingCount: jest.fn().mockResolvedValue(1),
      getDelayedCount: jest.fn().mockResolvedValue(0),
    };
    const feeds = {
      list: jest.fn().mockResolvedValue([{ id: 'f1' }, { id: 'f2' }]),
      listDueForUser: jest.fn(),
      getByIdForUser: jest.fn(),
    };

    const service = new QueueService(fakeQueue as never, feeds as never);
    const result = await service.scheduleAllForUser('u1');

    expect(result).toEqual({ queued: 2 });
    expect(add).toHaveBeenCalledTimes(2);
  });

  it('schedules only due feeds for a user', async () => {
    const add = jest.fn().mockResolvedValue({ id: 'job-1' });
    const fakeQueue = {
      add,
      getWaitingCount: jest.fn().mockResolvedValue(1),
      getDelayedCount: jest.fn().mockResolvedValue(0),
    };
    const feeds = {
      list: jest.fn(),
      listDueForUser: jest.fn().mockResolvedValue([{ id: 'f1' }]),
      getByIdForUser: jest.fn(),
    };

    const service = new QueueService(fakeQueue as never, feeds as never);
    const result = await service.scheduleDueForUser('u1', 30);

    expect(result).toEqual({ queued: 1 });
    expect(feeds.listDueForUser).toHaveBeenCalledWith('u1', 30, expect.any(Date));
    expect(add).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenCalledWith(
      'poll-feed',
      { feedId: 'f1' },
      { attempts: 3 },
    );
  });

  it('returns queue health counters', async () => {
    const fakeQueue = {
      add: jest.fn(),
      getWaitingCount: jest.fn().mockResolvedValue(2),
      getDelayedCount: jest.fn().mockResolvedValue(3),
    };
    const feeds = { list: jest.fn(), listDueForUser: jest.fn(), getByIdForUser: jest.fn() };

    const service = new QueueService(fakeQueue as never, feeds as never);
    const health = await service.health();

    expect(health).toEqual({ queue: 'rss-poll', waiting: 2, delayed: 3 });
  });
});
