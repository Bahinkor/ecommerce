import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from "@nestjs/common";
import { Response } from "express";

import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
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
  findOne(@Param("id") id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ticketsService.remove(+id);
  }
}
