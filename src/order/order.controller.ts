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
import { Request, Response } from "express";
import { AdminGuard } from "src/auth/admin/admin.guard";
import { JwtAuthGuard } from "src/auth/jwt-guard/jwt-guard.guard";
import { Order } from "src/order/entities/order.entity";

import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderService } from "./order.service";

@Controller({ path: "order", version: "1" })
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
