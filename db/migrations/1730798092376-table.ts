import { MigrationInterface, QueryRunner } from "typeorm";

export class Table1730798092376 implements MigrationInterface {
    name = 'Table1730798092376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "addedByUId" integer`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_e6e22cdf8c2668ff5d7a8c0cd93" FOREIGN KEY ("addedByUId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_e6e22cdf8c2668ff5d7a8c0cd93"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "addedByUId"`);
    }

}
