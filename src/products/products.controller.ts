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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { ResponseDto } from "../common/dto/response.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@ApiTags("Products")
@Controller({ path: "products", version: "1" })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: "Create a new product" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Product created successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Category not found" })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Products fetched successfully",
    type: ResponseDto,
  })
  @Get()
  async findAll(@Res() res: Response) {
    const products = await this.productsService.findAll();

    return res.status(HttpStatus.OK).json({
      data: products,
      statusCode: HttpStatus.OK,
      message: "Products fetched successfully",
    });
  }

  @ApiOperation({ summary: "Get product by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Product not found" })
  @Get(":id")
  async findOne(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);

    return res.status(HttpStatus.OK).json({
      data: product,
      statusCode: HttpStatus.OK,
      message: "Product fetched successfully",
    });
  }

  @ApiOperation({ summary: "Update a product by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product updated successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Category not found" })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: "Add product to basket" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product added to basket successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Product not found" })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: "Remove product from basket" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product removed from basket successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Product not found" })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: "Delete a product" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product deleted successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Product not found" })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
  @ApiBearerAuth()
  @Delete(":id")
  async remove(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    await this.productsService.remove(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Product deleted successfully",
    });
  }
}
