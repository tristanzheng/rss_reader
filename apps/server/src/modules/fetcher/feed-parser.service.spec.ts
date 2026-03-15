import { FeedParserService } from './feed-parser.service';

describe('FeedParserService', () => {
  it('normalizes parser output', async () => {
    const service = new FeedParserService();
    const parser = {
      parseURL: jest.fn().mockResolvedValue({
        items: [
          {
            title: 'Entry 1',
            link: 'https://example.com/1',
            guid: 'g1',
            content: 'body',
            isoDate: '2026-03-08T00:00:00.000Z',
          },
        ],
      }),
    };

    Object.assign(service as object, { parser });

    const result = await service.parse('f1', 'https://example.com/rss');
    expect(result).toHaveLength(1);
    expect(result[0].feedId).toBe('f1');
    expect(result[0].url).toBe('https://example.com/1');
  });
});
