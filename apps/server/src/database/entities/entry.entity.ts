import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FeedEntity } from './feed.entity';
import { EntryReadEntity } from './entry-read.entity';
import { EntrySaveEntity } from './entry-save.entity';

@Entity('entries')
@Index(['feedId', 'publishedAt'])
@Index(['url'])
export class EntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  feedId!: string;

  @Column({ type: 'varchar', length: 300 })
  title!: string;

  @Column({ type: 'varchar', length: 500 })
  url!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  guid!: string | null;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', nullable: true })
  fulltext!: string | null;

  @Column({ type: 'datetime' })
  publishedAt!: Date;

  @ManyToOne(() => FeedEntity, (feed) => feed.entries, { onDelete: 'CASCADE' })
  feed!: FeedEntity;

  @OneToMany(() => EntryReadEntity, (read) => read.entry)
  readBy!: EntryReadEntity[];

  @OneToMany(() => EntrySaveEntity, (save) => save.entry)
  savedBy!: EntrySaveEntity[];
}
