import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";

import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

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
}
