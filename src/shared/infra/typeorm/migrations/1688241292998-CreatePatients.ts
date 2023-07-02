import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePatients1688241292998 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "patients",
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
            name: "phone",
            type: "varchar",
            length: "20",
          },
          {
            name: "email",
            type: "varchar",
            length: "200",
          },
          {
            name: "height",
            type: "int",
          },
          {
            name: "weight",
            type: "numeric(3,1)",
          },
          {
            name: "birth_date",
            type: "date",
          },
          {
            name: "gender_id",
            type: "int",
          },
          {
            name: "doctor_id",
            type: "uuid",
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
            name: "FKDoctorsPatient",
            referencedTableName: "doctors",
            referencedColumnNames: ["id"],
            columnNames: ["doctor_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKGenderPatient",
            referencedTableName: "genders",
            referencedColumnNames: ["id"],
            columnNames: ["gender_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("patients");
  }
}
