import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1700000000000 implements MigrationInterface {
  name = 'Init1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "folders" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar(100) NOT NULL, "name" varchar(200) NOT NULL, "parentId" varchar)',
    );

    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "feeds" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar(100) NOT NULL, "folderId" varchar, "title" varchar(300) NOT NULL, "url" varchar(500) NOT NULL, "lastPolledAt" datetime, "lastPollStatus" varchar(32), "pollFailureCount" integer NOT NULL DEFAULT 0)',
    );

    await queryRunner.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_FEEDS_USER_URL" ON "feeds" ("userId", "url")',
    );

    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "entries" ("id" varchar PRIMARY KEY NOT NULL, "feedId" varchar NOT NULL, "title" varchar(300) NOT NULL, "url" varchar(500) NOT NULL, "guid" varchar(500), "content" text NOT NULL, "fulltext" text, "publishedAt" datetime NOT NULL)',
    );

    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "IDX_ENTRIES_FEED_PUBLISHED" ON "entries" ("feedId", "publishedAt")',
    );

    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "IDX_ENTRIES_URL" ON "entries" ("url")',
    );

    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "entry_reads" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar(100) NOT NULL, "entryId" varchar NOT NULL)',
    );

    await queryRunner.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ENTRY_READS_USER_ENTRY" ON "entry_reads" ("userId", "entryId")',
    );

    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "entry_saves" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar(100) NOT NULL, "entryId" varchar NOT NULL)',
    );

    await queryRunner.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ENTRY_SAVES_USER_ENTRY" ON "entry_saves" ("userId", "entryId")',
    );

    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "fetch_failures" ("id" varchar PRIMARY KEY NOT NULL, "feedId" varchar NOT NULL, "failCount" integer NOT NULL DEFAULT 0)',
    );

    await queryRunner.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_FETCH_FAILURES_FEED" ON "fetch_failures" ("feedId")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "fetch_failures"');
    await queryRunner.query('DROP TABLE IF EXISTS "entry_saves"');
    await queryRunner.query('DROP TABLE IF EXISTS "entry_reads"');
    await queryRunner.query('DROP TABLE IF EXISTS "entries"');
    await queryRunner.query('DROP TABLE IF EXISTS "feeds"');
    await queryRunner.query('DROP TABLE IF EXISTS "folders"');
  }
}
