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
import { FoldersService } from './folders.service';
import type { CreateFolderDto, UpdateFolderDto } from './folders.service';

@Controller('folders')
export class FoldersController {
  constructor(private readonly service: FoldersService) {}

  @Get()
  list(@CurrentUserId() userId: string) {
    return this.service.list(userId);
  }

  @Post()
  create(
    @CurrentUserId() userId: string,
    @Body() payload: Omit<CreateFolderDto, 'userId'>,
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
    @Body() payload: UpdateFolderDto,
  ) {
    const updated = await this.service.update(id, userId, payload);
    if (!updated) {
      throw new NotFoundException('Folder not found');
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUserId() userId: string) {
    const removed = await this.service.remove(id, userId);
    if (!removed) {
      throw new NotFoundException('Folder not found');
    }
    return { ok: true };
  }
}
