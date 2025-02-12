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
} from "@nestjs/common";
import { Response } from "express";

import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Res() res: Response, @Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);

    return res.status(HttpStatus.CREATED).json({
      data: category,
      statusCode: HttpStatus.CREATED,
      message: "Category created successfully",
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const categories = await this.categoriesService.findAll();

    return res.status(HttpStatus.OK).json({
      data: categories,
      statusCode: HttpStatus.OK,
      message: "Categories fetched successfully",
    });
  }

  @Put(":id")
  async update(
    @Res() res: Response,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param("id", ParseIntPipe) id: number,
  ) {
    await this.categoriesService.update(id, updateCategoryDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Category updated successfully",
    });
  }

  @Delete(":id")
  async delete(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    await this.categoriesService.remove(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Category removed successfully",
    });
  }
}
