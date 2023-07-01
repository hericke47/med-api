import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGenders1688241220013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "genders",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
          },
          {
            name: "name",
            type: "text",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );

    await queryRunner.query(
      `INSERT INTO genders(id, name, created_at, updated_at)
        values(1, 'Feminine', 'now()', 'now()')`
    );

    await queryRunner.query(
      `INSERT INTO genders(id, name, created_at, updated_at)
        values(2, 'Masculine', 'now()', 'now()')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("genders");
  }
}
