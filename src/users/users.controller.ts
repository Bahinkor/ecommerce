import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRoleEnum } from "./enums/user-role.enum";
import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller({ path: "users", version: "1" })
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: HttpStatus.CREATED, description: "User created successfully" })
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<object> {
    const newUser = await this.usersService.create(createUserDto);

    return res.status(HttpStatus.CREATED).json({
      data: newUser,
      statusCode: HttpStatus.CREATED,
      message: "User created successfully",
    });
  }

  @Get()
  @ApiOperation({ summary: "Get all users" })
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
  @ApiOperation({ summary: "Get a single user by id" })
  async findOne(@Param("id", ParseIntPipe) id: number, @Res() res: Response): Promise<object> {
    const user = await this.usersService.findOne(id);

    return res.status(HttpStatus.OK).json({
      data: user,
      statusCode: HttpStatus.OK,
      message: "User fetched successfully",
    });
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a user by id" })
  async update(
    @Res() res: Response,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<object> {
    const updatedUser = await this.usersService.update(id, updateUserDto);

    return res.status(HttpStatus.OK).json({
      data: updatedUser,
      statusCode: HttpStatus.OK,
      message: "User updated successfully",
    });
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a user by id" })
  async remove(@Param("id", ParseIntPipe) id: number, @Res() res: Response): Promise<object> {
    await this.usersService.delete(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "User deleted successfully",
    });
  }
}
