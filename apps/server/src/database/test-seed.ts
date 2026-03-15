import { Repository } from 'typeorm';
import { FeedEntity } from './entities';

export async function ensureFeed(
  repo: Repository<FeedEntity>,
  id: string,
  userId = 'seed-user',
): Promise<void> {
  const exists = await repo.findOne({ where: { id } });
  if (!exists) {
    await repo.save(
      repo.create({
        id,
        userId,
        title: `Seed ${id}`,
        url: `https://seed.test/${id}`,
        folderId: null,
      }),
    );
  }
}
