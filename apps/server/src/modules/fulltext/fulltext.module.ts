import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryEntity } from '../../database/entities';
import { FulltextController } from './fulltext.controller';
import { FulltextService } from './fulltext.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntryEntity])],
  controllers: [FulltextController],
  providers: [FulltextService],
})
export class FulltextModule {}
