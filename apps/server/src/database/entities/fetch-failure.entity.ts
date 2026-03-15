import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fetch_failures')
@Index(['feedId'], { unique: true })
export class FetchFailureEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  feedId!: string;

  @Column({ type: 'int', default: 0 })
  failCount!: number;
}
