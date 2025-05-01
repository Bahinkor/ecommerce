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
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { ResponseDto } from "../common/dto/response.dto";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("Categories")
@Controller({ path: "categories", version: "1" })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: "Create a new category" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Category created successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Res() res: Response, @Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);

    return res.status(HttpStatus.CREATED).json({
      data: category,
      statusCode: HttpStatus.CREATED,
      message: "Category created successfully",
    });
  }

  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Categories fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
  @Get()
  async findAll(@Res() res: Response) {
    const categories = await this.categoriesService.findAll();

    return res.status(HttpStatus.OK).json({
      data: categories,
      statusCode: HttpStatus.OK,
      message: "Categories fetched successfully",
    });
  }

  @ApiOperation({ summary: "Update a category by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Category updated successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Category not found" })
  @ApiBearerAuth()
  @Put(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Res() res: Response,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const category = await this.categoriesService.update(id, updateCategoryDto);

    return res.status(HttpStatus.OK).json({
      data: category,
      statusCode: HttpStatus.OK,
      message: "Category updated successfully",
    });
  }

  @ApiOperation({ summary: "Delete a category by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Category deleted successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Category not found" })
  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    await this.categoriesService.remove(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Category removed successfully",
    });
  }
}
