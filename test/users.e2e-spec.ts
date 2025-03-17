import type { INestApplication } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";

import { HttpStatus } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { DataSource } from "typeorm";

import type { CreateUserDto } from "../src/users/dto/create-user.dto";

import { AppModule } from "../src/app.module";
import { User } from "../src/users/entities/user.entity";
import UserRoleEnum from "../src/users/enums/user-role.enum";

describe("users resource e2e test", () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // clear the database (users table) before each test
    await dataSource.getRepository(User).delete({});
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

    createdUserId = response.body.data.id;
  });

  it("should return all users", async () => {
    const response = await request(app.getHttpServer()).get("/users").expect(HttpStatus.OK);

    expect(response.body.data).toMatchObject([new User()]);
  });

  it("should return a user by id", async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .expect(HttpStatus.OK);

    expect(response.body.data).toMatchObject(new User());
  });
});
