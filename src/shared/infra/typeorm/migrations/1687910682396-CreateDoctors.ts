import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDoctors1687910682396 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "doctors",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "name",
            type: "text",
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
            length: "200",
          },
          {
            name: "password",
            type: "varchar",
            length: "200",
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
          {
            name: "active",
            type: "boolean",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("doctors");
  }
}
