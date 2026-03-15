import { Body, Controller, Param, Post } from '@nestjs/common';
import { FetcherService, ParsedFeedEntry } from './fetcher.service';

interface IngestBody {
  entries: ParsedFeedEntry[];
}

@Controller('fetcher')
export class FetcherController {
  constructor(private readonly service: FetcherService) {}

  @Post('ingest')
  ingest(@Body() body: IngestBody) {
    return this.service.ingest(body.entries);
  }

  @Post('failure/:feedId')
  async failure(@Param('feedId') feedId: string) {
    const count = await this.service.recordFailure(feedId);
    return { feedId, failureCount: count };
  }
}
