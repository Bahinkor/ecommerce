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

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { ResponseDto } from "../common/dto/response.dto";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { TicketsService } from "./tickets.service";

@ApiTags("Tickets")
@ApiBearerAuth()
@Controller({ path: "tickets", version: "1" })
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiOperation({ summary: "Create a new ticket" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Ticket created successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @Post()
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    const userId: number = req.user.id;
    const newTicket = await this.ticketsService.create(createTicketDto, userId);

    return res.status(HttpStatus.CREATED).json({
      data: newTicket,
      statusCode: HttpStatus.CREATED,
      message: "Ticket created successfully",
    });
  }

  @ApiOperation({ summary: "Get all tickets" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Tickets fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
  @Get()
  @UseGuards(AdminGuard)
  async findAll(@Res() res: Response) {
    const tickets = await this.ticketsService.findAll();

    return res.status(HttpStatus.OK).json({
      data: tickets,
      statusCode: HttpStatus.OK,
      message: "Tickets fetched successfully",
    });
  }

  @ApiOperation({ summary: "Get all tickets by user id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Tickets fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @Get("/me")
  async findByUserId(@Req() req: Request, @Res() res: Response) {
    const userId = req.user.id;
    const tickets = await this.ticketsService.findByUserId(userId);

    return res.status(HttpStatus.OK).json({
      data: tickets,
      statusCode: HttpStatus.OK,
      message: "Tickets fetched successfully",
    });
  }

  @ApiOperation({ summary: "Get ticket by id and user id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ticket fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Ticket not found" })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @Get("/me/:id")
  async findByIdAndUserId(
    @Req() req: Request,
    @Res() res: Response,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    const ticket = await this.ticketsService.findByIdAndUserId(id, userId);

    return res.status(HttpStatus.OK).json({
      data: ticket,
      statusCode: HttpStatus.OK,
      message: "Ticket fetched successfully",
    });
  }

  @ApiOperation({ summary: "Get ticket by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ticket fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Ticket not found" })
  @Get(":id")
  @UseGuards(AdminGuard)
  async findOne(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    const ticket = await this.ticketsService.findOne(id);

    return res.status(HttpStatus.OK).json({
      data: ticket,
      statusCode: HttpStatus.OK,
      message: "Ticket fetched successfully",
    });
  }
}
