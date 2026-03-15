import { Module } from '@nestjs/common';
import { EntriesModule } from '../entries/entries.module';
import { ContentController } from './content.controller';

@Module({
  imports: [EntriesModule],
  controllers: [ContentController],
})
export class ContentModule {}
