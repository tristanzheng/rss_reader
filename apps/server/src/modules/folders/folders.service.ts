import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolderEntity } from '../../database/entities';

export interface CreateFolderDto {
  userId: string;
  name: string;
  parentId?: string | null;
}

export interface UpdateFolderDto {
  name?: string;
  parentId?: string | null;
}

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(FolderEntity)
    private readonly repository: Repository<FolderEntity>,
  ) {}

  list(userId: string): Promise<FolderEntity[]> {
    return this.repository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  create(payload: CreateFolderDto): Promise<FolderEntity> {
    const folder = this.repository.create({
      userId: payload.userId,
      name: payload.name,
      parentId: payload.parentId ?? null,
    });
    return this.repository.save(folder);
  }

  getByIdForUser(id: string, userId: string): Promise<FolderEntity | null> {
    return this.repository.findOne({ where: { id, userId } });
  }

  async update(
    id: string,
    userId: string,
    payload: UpdateFolderDto,
  ): Promise<FolderEntity | null> {
    const folder = await this.getByIdForUser(id, userId);
    if (!folder) {
      return null;
    }

    folder.name = payload.name ?? folder.name;
    folder.parentId = payload.parentId ?? folder.parentId;
    return this.repository.save(folder);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const result = await this.repository.delete({ id, userId });
    return (result.affected ?? 0) > 0;
  }
}
