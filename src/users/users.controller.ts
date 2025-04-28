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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { ResponseDto } from "../common/dto/response.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRoleEnum } from "./enums/user-role.enum";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth()
@Controller({ path: "users", version: "1" })
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User created successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Users fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
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
  @ApiOperation({ summary: "Get one user by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
  @ApiParam({ name: "id", type: "number", description: "User id" })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Users updated successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
  @ApiParam({ name: "id", type: "number", description: "User id" })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Users deleted successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
  @ApiParam({ name: "id", type: "number", description: "User id" })
  async remove(@Param("id", ParseIntPipe) id: number, @Res() res: Response): Promise<object> {
    await this.usersService.delete(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "User deleted successfully",
    });
  }
}
