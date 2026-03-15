import { PollExecutorService } from './poll-executor.service';

describe('PollExecutorService', () => {
  it('parses feed, ingests entries, and marks poll success', async () => {
    const feeds = {
      getById: jest.fn().mockResolvedValue({
        id: 'f1',
        title: 'Feed 1',
        url: 'https://example.com/rss',
      }),
      getByIdForUser: jest.fn().mockResolvedValue({
        id: 'f1',
        userId: 'u1',
      }),
      markPollSuccess: jest.fn(),
      markPollFailure: jest.fn(),
    };
    const parser = {
      parse: jest.fn().mockResolvedValue([
        {
          feedId: 'f1',
          title: 'Entry 1',
          url: 'https://example.com/1',
          guid: 'g1',
          content: 'hello',
          publishedAt: '2026-03-08T00:00:00.000Z',
        },
      ]),
    };
    const fetcher = {
      ingest: jest.fn().mockResolvedValue({ inserted: 1, skipped: 0 }),
      recordFailure: jest.fn(),
    };

    const service = new PollExecutorService(
      feeds as never,
      parser as never,
      fetcher as never,
    );
    const result = await service.run('f1');

    expect(result.status).toBe('ok');
    expect(parser.parse).toHaveBeenCalledWith('f1', 'https://example.com/rss');
    expect(fetcher.ingest).toHaveBeenCalledTimes(1);
    expect(feeds.markPollSuccess).toHaveBeenCalledWith('f1');
    expect(feeds.markPollFailure).not.toHaveBeenCalled();
  });

  it('returns forbidden_or_not_found for user-unowned feed', async () => {
    const feeds = {
      getById: jest.fn(),
      getByIdForUser: jest.fn().mockResolvedValue(null),
      markPollSuccess: jest.fn(),
      markPollFailure: jest.fn(),
    };
    const parser = {
      parse: jest.fn(),
    };
    const fetcher = {
      ingest: jest.fn(),
      recordFailure: jest.fn(),
    };

    const service = new PollExecutorService(
      feeds as never,
      parser as never,
      fetcher as never,
    );
    const result = await service.runForUser('u1', 'f1');

    expect(result).toEqual({ status: 'failed', reason: 'forbidden_or_not_found' });
    expect(feeds.getByIdForUser).toHaveBeenCalledWith('f1', 'u1');
    expect(feeds.getById).not.toHaveBeenCalled();
  });

  it('runs owned feed for user', async () => {
    const feeds = {
      getById: jest.fn().mockResolvedValue({
        id: 'f1',
        title: 'Feed 1',
        url: 'https://example.com/rss',
      }),
      getByIdForUser: jest.fn().mockResolvedValue({ id: 'f1', userId: 'u1' }),
      markPollSuccess: jest.fn(),
      markPollFailure: jest.fn(),
    };
    const parser = {
      parse: jest.fn().mockResolvedValue([]),
    };
    const fetcher = {
      ingest: jest.fn().mockResolvedValue({ inserted: 0, skipped: 0 }),
      recordFailure: jest.fn(),
    };

    const service = new PollExecutorService(
      feeds as never,
      parser as never,
      fetcher as never,
    );
    const result = await service.runForUser('u1', 'f1');

    expect(result.status).toBe('ok');
  });

  it('records failure when parse fails and marks feed failure', async () => {
    const feeds = {
      getById: jest.fn().mockResolvedValue({
        id: 'f1',
        title: 'Feed 1',
        url: 'https://example.com/rss',
      }),
      getByIdForUser: jest.fn(),
      markPollSuccess: jest.fn(),
      markPollFailure: jest.fn(),
    };
    const parser = {
      parse: jest.fn().mockRejectedValue(new Error('fetch failed')),
    };
    const fetcher = {
      ingest: jest.fn(),
      recordFailure: jest.fn().mockResolvedValue(1),
    };

    const service = new PollExecutorService(
      feeds as never,
      parser as never,
      fetcher as never,
    );
    const result = await service.run('f1');

    expect(result.status).toBe('failed');
    expect(result.reason).toBe('parse_failed');
    expect(fetcher.recordFailure).toHaveBeenCalledWith('f1');
    expect(feeds.markPollFailure).toHaveBeenCalledWith('f1');
  });

  it('records failure when feed does not exist', async () => {
    const feeds = {
      getById: jest.fn().mockResolvedValue(null),
      getByIdForUser: jest.fn(),
      markPollSuccess: jest.fn(),
      markPollFailure: jest.fn(),
    };
    const parser = {
      parse: jest.fn(),
    };
    const fetcher = {
      ingest: jest.fn(),
      recordFailure: jest.fn().mockResolvedValue(1),
    };

    const service = new PollExecutorService(
      feeds as never,
      parser as never,
      fetcher as never,
    );
    const result = await service.run('missing-feed');

    expect(result.status).toBe('failed');
    expect(result.reason).toBe('feed_not_found');
    expect(fetcher.recordFailure).toHaveBeenCalledWith('missing-feed');
    expect(parser.parse).not.toHaveBeenCalled();
  });
});
