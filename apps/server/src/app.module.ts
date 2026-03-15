import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { typeOrmOptions } from './database/typeorm.options';
import { AuthModule } from './modules/auth/auth.module';
import { FeedsModule } from './modules/feeds/feeds.module';
import { FoldersModule } from './modules/folders/folders.module';
import { EntriesModule } from './modules/entries/entries.module';
import { ContentModule } from './modules/content/content.module';
import { OpmlModule } from './modules/opml/opml.module';
import { FetcherModule } from './modules/fetcher/fetcher.module';
import { FulltextModule } from './modules/fulltext/fulltext.module';
import { QueueModule } from './modules/queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
    }),
    TypeOrmModule.forRoot(typeOrmOptions),
    AuthModule,
    FeedsModule,
    FoldersModule,
    EntriesModule,
    ContentModule,
    OpmlModule,
    FetcherModule,
    FulltextModule,
    QueueModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
