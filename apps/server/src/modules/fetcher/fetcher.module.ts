import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryEntity, FetchFailureEntity } from '../../database/entities';
import { FetcherController } from './fetcher.controller';
import { FeedParserService } from './feed-parser.service';
import { FetcherService } from './fetcher.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntryEntity, FetchFailureEntity])],
  controllers: [FetcherController],
  providers: [FetcherService, FeedParserService],
  exports: [FetcherService, FeedParserService],
})
export class FetcherModule {}
