import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUserId } from '../../common/user-context.decorator';
import { EntriesService } from './entries.service';
import type { EntryQuery } from './entries.service';

@Controller('entries')
export class EntriesController {
  constructor(private readonly service: EntriesService) {}

  @Get()
  list(@CurrentUserId() userId: string, @Query() query: EntryQuery) {
    return this.service.list(userId, query);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const entry = await this.service.detail(id);
    if (!entry) {
      throw new NotFoundException('Entry not found');
    }
    return entry;
  }

  @Post(':id/read')
  async markRead(@Param('id') id: string, @CurrentUserId() userId: string) {
    await this.service.markRead(userId, id);
    return { ok: true };
  }

  @Delete(':id/read')
  async markUnread(@Param('id') id: string, @CurrentUserId() userId: string) {
    await this.service.markUnread(userId, id);
    return { ok: true };
  }

  @Post(':id/save')
  async save(@Param('id') id: string, @CurrentUserId() userId: string) {
    await this.service.save(userId, id);
    return { ok: true };
  }

  @Delete(':id/save')
  async unsave(@Param('id') id: string, @CurrentUserId() userId: string) {
    await this.service.unsave(userId, id);
    return { ok: true };
  }
}
