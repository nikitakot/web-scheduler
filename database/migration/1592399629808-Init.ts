import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1592399629808 implements MigrationInterface {
    name = 'Init1592399629808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "monitored-result" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "statusCode" integer NOT NULL, "payload" character varying NOT NULL, "monitoredEndpointId" uuid, CONSTRAINT "PK_a81ef84ac90153e8a1d080d72f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "monitored-endpoint" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, "url" character varying NOT NULL, "monitoredInterval" integer NOT NULL, "disabled" boolean NOT NULL DEFAULT false, "ownerId" uuid, CONSTRAINT "PK_62a2c228026316665d87925c2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "monitored-result" ADD CONSTRAINT "FK_81a688dca26050b823142d5a446" FOREIGN KEY ("monitoredEndpointId") REFERENCES "monitored-endpoint"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monitored-endpoint" ADD CONSTRAINT "FK_343079c7964649236e33480bb4a" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monitored-endpoint" DROP CONSTRAINT "FK_343079c7964649236e33480bb4a"`);
        await queryRunner.query(`ALTER TABLE "monitored-result" DROP CONSTRAINT "FK_81a688dca26050b823142d5a446"`);
        await queryRunner.query(`DROP TABLE "monitored-endpoint"`);
        await queryRunner.query(`DROP TABLE "monitored-result"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
