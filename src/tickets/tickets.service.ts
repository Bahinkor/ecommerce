import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { UsersService } from "../users/users.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { Ticket } from "./entities/ticket.entity";
import { TicketsRepository } from "./tickets.repository";

@Injectable()
export class TicketsService {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly userService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto, userId: number): Promise<Ticket> {
    const user = await this.userService.findOne(userId);

    let replayToTicket: Ticket | null = null;
    if (createTicketDto.replayTo) {
      replayToTicket = await this.findOne(createTicketDto.replayTo);
      if (replayToTicket.replyTo !== null)
        throw new BadRequestException("You are not allowed to reply to this ticket.");
    }

    return this.ticketsRepository.create(createTicketDto, user, replayToTicket);
  }

  findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.findAll();
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne(id);
    if (!ticket) throw new NotFoundException(`Ticket id ${id} not found`);
    return ticket;
  }

  async findByUserId(userId: number): Promise<Ticket[]> {
    return this.ticketsRepository.findByUserId(userId);
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findByIdAndUserId(id, userId);
    if (!ticket) throw new NotFoundException(`Ticket id ${id} not found`);
    return ticket;
  }
}
