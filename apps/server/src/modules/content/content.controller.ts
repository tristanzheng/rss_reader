import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { CurrentUserId } from '../../common/user-context.decorator';
import { EntriesService } from '../entries/entries.service';
import type { EntryQuery } from '../entries/entries.service';

@Controller('content')
export class ContentController {
  constructor(private readonly entriesService: EntriesService) {}

  @Get('entries')
  list(@CurrentUserId() userId: string, @Query() query: EntryQuery) {
    return this.entriesService.list(userId, query);
  }

  @Get('entries/:id')
  async detail(@Param('id') id: string) {
    const entry = await this.entriesService.detail(id);
    if (!entry) {
      throw new NotFoundException('Entry not found');
    }
    return entry;
  }
}
