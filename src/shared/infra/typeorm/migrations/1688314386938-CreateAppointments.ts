import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAppointments1688314386938 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "appointments",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "date",
            type: "timestamp",
          },
          {
            name: "notes",
            type: "text",
            isNullable: true,
          },
          {
            name: "doctor_id",
            type: "uuid",
          },
          {
            name: "patient_id",
            type: "uuid",
          },
          {
            name: "appointment_status_id",
            type: "int",
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
        foreignKeys: [
          {
            name: "FKDoctorsAppointment",
            referencedTableName: "doctors",
            referencedColumnNames: ["id"],
            columnNames: ["doctor_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKPatientAppointment",
            referencedTableName: "patients",
            referencedColumnNames: ["id"],
            columnNames: ["patient_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKAppointmentStatus",
            referencedTableName: "appointment_status",
            referencedColumnNames: ["id"],
            columnNames: ["appointment_status_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("appointments");
  }
}
