import type { TestingModule } from "@nestjs/testing";

import { Test } from "@nestjs/testing";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
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
});
