import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@Controller({ path: "products", version: "1" })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Res() res: Response, @Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);

    return res.status(HttpStatus.CREATED).json({
      data: product,
      statusCode: HttpStatus.CREATED,
      message: "Product created successfully",
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const products = await this.productsService.findAll();

    return res.status(HttpStatus.OK).json({
      data: products,
      statusCode: HttpStatus.OK,
      message: "Products fetched successfully",
    });
  }

  @Get(":id")
  async findOne(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);

    return res.status(HttpStatus.OK).json({
      data: product,
      statusCode: HttpStatus.OK,
      message: "Product fetched successfully",
    });
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Res() res: Response,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);

    return res.status(HttpStatus.OK).json({
      data: product,
      statusCode: HttpStatus.OK,
      message: "Product updated successfully",
    });
  }

  @Post("basket/:productId")
  @UseGuards(JwtAuthGuard)
  async addBasket(
    @Res() res: Response,
    @Req() req: Request,
    @Param("productId", ParseIntPipe) productId: number,
  ) {
    const userId = req.user.id;
    await this.productsService.addItemToBasket(productId, userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Product added to basket successfully",
    });
  }

  @Delete("basket/:productId")
  @UseGuards(JwtAuthGuard)
  async removeBasket(
    @Res() res: Response,
    @Req() req: Request,
    @Param("productId", ParseIntPipe) productId: number,
  ) {
    const userId = req.user.id;
    await this.productsService.removeItemFromBasket(productId, userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Product removes to basket successfully",
    });
  }

  @Delete(":id")
  async remove(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    await this.productsService.remove(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Product deleted successfully",
    });
  }
}
