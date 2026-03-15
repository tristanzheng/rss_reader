import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntryEntity } from './entry.entity';

@Entity('entry_saves')
@Index(['userId', 'entryId'], { unique: true })
export class EntrySaveEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  userId!: string;

  @Column({ type: 'uuid' })
  entryId!: string;

  @ManyToOne(() => EntryEntity, (entry) => entry.savedBy, { onDelete: 'CASCADE' })
  entry!: EntryEntity;
}
