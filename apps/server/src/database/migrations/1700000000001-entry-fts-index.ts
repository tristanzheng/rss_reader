import { MigrationInterface, QueryRunner } from 'typeorm';

export class EntryFtsIndex1700000000001 implements MigrationInterface {
  name = 'EntryFtsIndex1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.connection.options.type !== 'postgres') {
      return;
    }

    await queryRunner.query(
      "CREATE INDEX IF NOT EXISTS \"IDX_ENTRIES_FTS\" ON \"entries\" USING GIN (to_tsvector('simple', coalesce(\"title\", '') || ' ' || coalesce(\"content\", '')))",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.connection.options.type !== 'postgres') {
      return;
    }

    await queryRunner.query('DROP INDEX IF EXISTS "IDX_ENTRIES_FTS"');
  }
}
