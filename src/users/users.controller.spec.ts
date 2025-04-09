import type { TestingModule } from "@nestjs/testing";

import { HttpStatus } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";

import { User } from "./entities/user.entity";
import { UserRoleEnum } from "./enums/user-role.enum";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUserService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUserService }],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(usersController).toBeDefined();
  });

  it("calls UserController.create and returns the new user", async () => {
    const createUserDto: CreateUserDto = {
      display_name: "Jon Deno",
      phone_number: "09113456789",
      password: "test_pass",
      role: UserRoleEnum.NormalUser,
    };

    const createdUser = {
      id: 1,
      ...createUserDto,
    };

    mockUserService.create.mockResolvedValue(createdUser);

    const res = mockResponse();

    await usersController.create(createUserDto, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
  });

  it("calls UserController.findAll and returns the all users", async () => {
    const res = mockResponse();

    mockUserService.findAll.mockResolvedValue([new User()]);

    await usersController.findAll(res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it("calls UserController.findOne and returns the user", async () => {
    const res = mockResponse();

    mockUserService.findOne.mockResolvedValue(new User());

    await usersController.findOne(1, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it("calls UserController.update and returns the updated user", async () => {
    const res = mockResponse();
    const updateUserDto: UpdateUserDto = {
      display_name: "Jon Deno",
      role: UserRoleEnum.NormalUser,
    };

    mockUserService.update.mockResolvedValue(new User());

    await usersController.update(res, 1, updateUserDto);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it("calls UserController.delete and returns the res", async () => {
    const res = mockResponse();

    mockUserService.remove.mockResolvedValue(undefined);

    await usersController.remove(1, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });
});
