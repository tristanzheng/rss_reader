import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntryEntity } from './entry.entity';

@Entity('entry_reads')
@Index(['userId', 'entryId'], { unique: true })
export class EntryReadEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  userId!: string;

  @Column({ type: 'uuid' })
  entryId!: string;

  @ManyToOne(() => EntryEntity, (entry) => entry.readBy, { onDelete: 'CASCADE' })
  entry!: EntryEntity;
}
