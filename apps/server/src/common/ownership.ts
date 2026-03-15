import { ForbiddenException, NotFoundException } from '@nestjs/common';

export function ensureOwnedResource(
  ownerId: string | undefined,
  userId: string,
  notFoundMessage: string,
): void {
  if (!ownerId) {
    throw new NotFoundException(notFoundMessage);
  }
  if (ownerId !== userId) {
    throw new ForbiddenException('Forbidden');
  }
}
