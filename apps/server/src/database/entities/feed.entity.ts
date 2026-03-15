import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { FolderEntity } from './folder.entity';
import { EntryEntity } from './entry.entity';

@Entity('feeds')
@Unique(['userId', 'url'])
export class FeedEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  userId!: string;

  @Column({ type: 'uuid', nullable: true })
  folderId!: string | null;

  @Column({ type: 'varchar', length: 300 })
  title!: string;

  @Column({ type: 'varchar', length: 500 })
  url!: string;

  @Column({ type: 'datetime', nullable: true })
  lastPolledAt!: Date | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  lastPollStatus!: 'ok' | 'failed' | null;

  @Column({ type: 'int', default: 0 })
  pollFailureCount!: number;

  @ManyToOne(() => FolderEntity, (folder) => folder.feeds, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  folder?: FolderEntity | null;

  @OneToMany(() => EntryEntity, (entry) => entry.feed)
  entries!: EntryEntity[];
}
