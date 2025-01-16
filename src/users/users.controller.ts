import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
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
  async findOne(@Param("id") id: string, @Res() res: Response): Promise<object> {
    const user = await this.usersService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      data: user,
      statusCode: HttpStatus.OK,
      message: "User fetched successfully",
    });
  }

  @Put(":id")
  async update(
    @Res() res: Response,
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<object> {
    const updatedUser = await this.usersService.update(+id, updateUserDto);

    return res.status(HttpStatus.OK).json({
      data: updatedUser,
      statusCode: HttpStatus.OK,
      message: "User updated successfully",
    });
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res() res: Response): Promise<object> {
    await this.usersService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "User deleted successfully",
    });
  }
}
