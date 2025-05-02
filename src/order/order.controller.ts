import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AdminGuard } from "src/auth/admin/admin.guard";
import { JwtAuthGuard } from "src/auth/jwt-guard/jwt-guard.guard";
import { Order } from "src/order/entities/order.entity";

import { ResponseDto } from "../common/dto/response.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderService } from "./order.service";

@ApiTags("Order")
@ApiBearerAuth()
@Controller({ path: "order", version: "1" })
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: "Create a new order" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Order created successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Product not found" })
  @Post()
  async create(@Req() req: Request, @Res() res: Response, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id;
    const order: Order = await this.orderService.create(createOrderDto, userId);

    return res.status(HttpStatus.CREATED).json({
      data: order,
      statusCode: HttpStatus.CREATED,
      message: "Order created successfully",
    });
  }

  @ApiOperation({ summary: "Get all orders" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Orders fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
  @Get()
  @UseGuards(AdminGuard)
  async findAll(@Res() res: Response) {
    const orders: Order[] = await this.orderService.findAll();

    return res.status(HttpStatus.OK).json({
      data: orders,
      statusCode: HttpStatus.OK,
      message: "Orders fetched successfully",
    });
  }

  @ApiOperation({ summary: "Get order by user id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Orders fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
  @Get(":id")
  async findOne(@Req() req: Request, @Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    const userId = req.user.id;
    const order: Order = await this.orderService.findOneByIdAndUserId(id, userId);

    return res.status(HttpStatus.OK).json({
      data: order,
      statusCode: HttpStatus.OK,
      message: "Order fetched successfully",
    });
  }
}
