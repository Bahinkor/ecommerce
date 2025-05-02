import {
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

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { ResponseDto } from "../common/dto/response.dto";
import { PaymentService } from "./payment.service";

@ApiTags("Payment")
@ApiBearerAuth()
@Controller({ path: "payments", version: "1" })
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: "Create a new payment" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Payment created successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Order not found" })
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

  @ApiOperation({ summary: "Verify a payment" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Payment verified successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "track id not found" })
  @Post("verify/:trackId")
  async verify(@Res() res: Response, @Param("trackId", ParseIntPipe) trackId: number) {
    const payment = await this.paymentService.verify(trackId);

    return res.status(HttpStatus.OK).json({
      data: payment,
      statusCode: HttpStatus.OK,
      message: "Payment verified successfully",
    });
  }

  @ApiOperation({ summary: "Get all payments" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Payments found successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
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
