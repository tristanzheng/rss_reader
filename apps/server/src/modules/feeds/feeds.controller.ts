import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUserId } from '../../common/user-context.decorator';
import { FeedsService } from './feeds.service';
import type { CreateFeedDto, UpdateFeedDto } from './feeds.service';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly service: FeedsService) {}

  @Get()
  list(@CurrentUserId() userId: string) {
    return this.service.list(userId);
  }

  @Post()
  create(
    @CurrentUserId() userId: string,
    @Body() payload: Omit<CreateFeedDto, 'userId'>,
  ) {
    return this.service.create({
      ...payload,
      userId,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() payload: UpdateFeedDto,
  ) {
    const updated = await this.service.update(id, userId, payload);
    if (!updated) {
      throw new NotFoundException('Feed not found');
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUserId() userId: string) {
    const removed = await this.service.remove(id, userId);
    if (!removed) {
      throw new NotFoundException('Feed not found');
    }
    return { ok: true };
  }
}
