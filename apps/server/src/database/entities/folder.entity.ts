import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FeedEntity } from './feed.entity';

@Entity('folders')
export class FolderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  userId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'uuid', nullable: true })
  parentId!: string | null;

  @OneToMany(() => FeedEntity, (feed) => feed.folder)
  feeds!: FeedEntity[];
}
