import type { INestApplication } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import type { QueryRunner } from "typeorm";

import { HttpStatus } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { DataSource } from "typeorm";

import type { CreateUserDto } from "../src/users/dto/create-user.dto";

import { AppModule } from "../src/app.module";
import { User } from "../src/users/entities/user.entity";
import UserRoleEnum from "../src/users/enums/userRole.enum";

describe("users resource e2e test", () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    const queryRunner: QueryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.query("SET FOREIGN_KEY_CHECKS=0;"); // Disable foreign key checks to allow truncation
    await queryRunner.query("TRUNCATE TABLE users;"); // Remove all records from the users table
    await queryRunner.query("SET FOREIGN_KEY_CHECKS=1;"); // Re-enable foreign key checks after truncation

    await queryRunner.release();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create and return a user", async () => {
    const exampleUser: CreateUserDto = {
      display_name: "Jon Snow",
      phone_number: "09110000000",
      password: "123456",
      role: UserRoleEnum.NormalUser,
    };
    const response = await request(app.getHttpServer())
      .post("/users")
      .send(exampleUser)
      .expect(HttpStatus.CREATED);

    expect(response.body).toMatchObject(new User());
  });

  it("should return all users", async () => {
    const response = await request(app.getHttpServer()).get("/users").expect(HttpStatus.OK);

    expect(response.body).toMatchObject(new User());
  });
});
