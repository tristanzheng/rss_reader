import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Public } from '../../common/auth/public.decorator';
import { Roles } from '../../common/auth/roles.decorator';
import { CurrentUserId } from '../../common/user-context.decorator';
import { QueueService } from './queue.service';
import { PollExecutorService } from './poll-executor.service';

interface EnqueueBody {
  feedId: string;
}

@Controller('queue')
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
    private readonly executor: PollExecutorService,
  ) {}

  @Post('poll')
  enqueue(@CurrentUserId() userId: string, @Body() body: EnqueueBody) {
    return this.queueService.enqueueFeedPollForUser(userId, body.feedId);
  }

  @Post('schedule')
  @Roles('worker', 'admin')
  schedule(@CurrentUserId() userId: string) {
    return this.queueService.scheduleAllForUser(userId);
  }

  @Post('schedule-due')
  @Roles('worker', 'admin')
  scheduleDue(
    @CurrentUserId() userId: string,
    @Query('intervalMinutes') intervalMinutes = '30',
  ) {
    return this.queueService.scheduleDueForUser(
      userId,
      Number(intervalMinutes),
    );
  }

  @Post('run-now')
  @Roles('worker', 'admin')
  runNow(@CurrentUserId() userId: string, @Body() body: EnqueueBody) {
    return this.executor.runForUser(userId, body.feedId);
  }

  @Public()
  @Get('health')
  health() {
    return this.queueService.health();
  }
}
