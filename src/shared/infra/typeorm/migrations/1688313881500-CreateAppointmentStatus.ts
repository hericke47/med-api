import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAppointmentStatus1688313881500
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "appointment_status",
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
      `INSERT INTO appointment_status(id, name, created_at, updated_at)
        values(1, 'Pending', 'now()', 'now()')`
    );

    await queryRunner.query(
      `INSERT INTO appointment_status(id, name, created_at, updated_at)
        values(2, 'Concluded', 'now()', 'now()')`
    );

    await queryRunner.query(
      `INSERT INTO appointment_status(id, name, created_at, updated_at)
        values(3, 'Canceled', 'now()', 'now()')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("appointment_status");
  }
}
