import { Module } from '@nestjs/common';
import { FeedsModule } from '../feeds/feeds.module';
import { FoldersModule } from '../folders/folders.module';
import { OpmlController } from './opml.controller';
import { OpmlService } from './opml.service';

@Module({
  imports: [FeedsModule, FoldersModule],
  controllers: [OpmlController],
  providers: [OpmlService],
})
export class OpmlModule {}
