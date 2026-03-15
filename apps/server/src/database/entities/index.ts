import { EntryEntity } from './entry.entity';
import { EntryReadEntity } from './entry-read.entity';
import { EntrySaveEntity } from './entry-save.entity';
import { FeedEntity } from './feed.entity';
import { FetchFailureEntity } from './fetch-failure.entity';
import { FolderEntity } from './folder.entity';

export const entities = [
  FeedEntity,
  FolderEntity,
  EntryEntity,
  EntryReadEntity,
  EntrySaveEntity,
  FetchFailureEntity,
];

export {
  FeedEntity,
  FolderEntity,
  EntryEntity,
  EntryReadEntity,
  EntrySaveEntity,
  FetchFailureEntity,
};
