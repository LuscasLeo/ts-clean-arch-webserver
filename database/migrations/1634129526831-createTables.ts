import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createTables1634129526831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            length: "110",
          },
          {
            name: "password",
            type: "varchar",
            length: "255",
          },
          {
            name: "roles",
            type: "text",
            isArray: true,
            enum: ["USER", "ADVANCED", "USERADMIN", "ADMIN"],
          },
          {
            name: "created_at",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            default: "now()",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
