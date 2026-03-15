import { QueueController } from './queue.controller';

describe('QueueController', () => {
  it('schedules by user, schedules due, and runs now with user scope', async () => {
    const queueService = {
      enqueueFeedPollForUser: jest.fn().mockResolvedValue({ id: 'job-1' }),
      scheduleAllForUser: jest.fn().mockResolvedValue({ queued: 2 }),
      scheduleDueForUser: jest.fn().mockResolvedValue({ queued: 1 }),
      health: jest.fn(),
    };
    const executor = {
      runForUser: jest.fn().mockResolvedValue({ status: 'ok', inserted: 1, skipped: 0 }),
    };

    const controller = new QueueController(
      queueService as never,
      executor as never,
    );

    await controller.enqueue('u1', { feedId: 'f1' });
    const scheduled = await controller.schedule('u1');
    const scheduledDue = await controller.scheduleDue('u1', '15');
    const runNow = await controller.runNow('u1', { feedId: 'f1' });

    expect(queueService.enqueueFeedPollForUser).toHaveBeenCalledWith('u1', 'f1');
    expect(scheduled).toEqual({ queued: 2 });
    expect(scheduledDue).toEqual({ queued: 1 });
    expect(queueService.scheduleDueForUser).toHaveBeenCalledWith('u1', 15);
    expect(executor.runForUser).toHaveBeenCalledWith('u1', 'f1');
    expect(runNow.status).toBe('ok');
  });
});
