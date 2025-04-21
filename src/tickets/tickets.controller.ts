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

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { TicketsService } from "./tickets.service";

@Controller("tickets")
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(@Res() res: Response, @Body() createTicketDto: CreateTicketDto) {
    const newTicket = await this.ticketsService.create(createTicketDto);

    return res.status(HttpStatus.CREATED).json({
      data: newTicket,
      statusCode: HttpStatus.CREATED,
      message: "Ticket created successfully",
    });
  }

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
