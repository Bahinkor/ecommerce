import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { Response } from "express";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import UserRoleEnum from "./enums/userRole.enum";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<object> {
    const newUser = await this.usersService.create(createUserDto);

    return res.status(HttpStatus.CREATED).json({
      data: newUser,
      statusCode: HttpStatus.CREATED,
      message: "User created successfully",
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query("role") role?: UserRoleEnum,
    @Query("limit") limit: number = 10,
    @Query("page") page: number = 1,
  ): Promise<object> {
    const users = await this.usersService.findAll(role, limit, page);

    return res.status(HttpStatus.OK).json({
      data: users,
      statusCode: HttpStatus.OK,
      message: "Users fetched successfully",
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
