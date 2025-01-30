import { Body, Controller, Get, HttpStatus, Param, Post, Res } from "@nestjs/common";
import { Response } from "express";

import { CreateTicketDto } from "./dto/create-ticket.dto";
import { TicketsService } from "./tickets.service";

@Controller("tickets")
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
  async findAll(@Res() res: Response) {
    const tickets = await this.ticketsService.findAll();

    return res.status(HttpStatus.OK).json({
      data: tickets,
      statusCode: HttpStatus.OK,
      message: "Tickets fetched successfully",
    });
  }

  @Get(":id")
  async findOne(@Res() res: Response, @Param("id") id: string) {
    const ticket = await this.ticketsService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      data: ticket,
      statusCode: HttpStatus.OK,
      message: "Ticket fetched successfully",
    });
  }
}
