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
import { PaymentService } from "./payment.service";

@Controller({ path: "payments", version: "1" })
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("create/:orderId")
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Param("orderId", ParseIntPipe) orderId: number,
  ) {
    const userId = req.user.id;
    const payment = await this.paymentService.create(orderId, userId);

    return res.status(HttpStatus.CREATED).json({
      data: payment,
      statusCode: HttpStatus.CREATED,
      message: "Payment created successfully",
    });
  }

  @Post("verify/:trackId")
  async verify(@Res() res: Response, @Param("trackId", ParseIntPipe) trackId: number) {
    const payment = await this.paymentService.verify(trackId);

    return res.status(HttpStatus.OK).json({
      data: payment,
      statusCode: HttpStatus.OK,
      message: "Payment verified successfully",
    });
  }

  @Get()
  @UseGuards(AdminGuard)
  async findAll(@Res() res: Response) {
    const payments = await this.paymentService.findAll();

    return res.status(HttpStatus.OK).json({
      data: payments,
      statusCode: HttpStatus.OK,
      message: "Payments found successfully",
    });
  }
}
