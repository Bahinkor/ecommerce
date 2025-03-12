import type { TestingModule } from "@nestjs/testing";
import type { Repository } from "typeorm";

import { Test } from "@nestjs/testing";
import { mock } from "node:test";

import type { CreateUserDto } from "./dto/create-user.dto";

import { User } from "./entities/user.entity";
import UserRoleEnum from "./enums/userRole.enum";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([User]),
  };

  const mockUserRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, { provide: "UserRepository", useValue: mockUserRepository }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
  });

  it("calls UserService.create and returns the new user", async () => {
    const createUserDto: CreateUserDto = {
      display_name: "Jon Deno",
      phone_number: "09113456789",
      password: "test_pass",
      role: UserRoleEnum.NormalUser,
    };

    const savedUser: User = {
      id: 1,
      display_name: "Jon Deno",
      phone_number: "09113456789",
      password: "hashed_password",
      role: UserRoleEnum.NormalUser,
      created_at: new Date(),
      updated_at: new Date(),
      addresses: [],
      basket_items: [],
      comments: [],
      likes: [],
      tickets: [],
    };

    mockUserRepository.create.mockReturnValue(savedUser);
    mockUserRepository.save.mockResolvedValue(savedUser);

    const result = await usersService.create(createUserDto);

    expect(result).toEqual(
      expect.objectContaining({ display_name: "Jon Deno", phone_number: "09113456789" }),
    );

    expect(result.password).not.toBe(createUserDto.password);
  });

  it("calls UserService.findAll and returns the result", async () => {
    const result: User[] = [new User()];

    jest.spyOn(usersService, "findAll").mockResolvedValue(result);
    await expect(usersService.findAll()).resolves.toEqual(result);
  });
});
