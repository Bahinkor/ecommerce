import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../users/entities/user.entity";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { Ticket } from "./entities/ticket.entity";

@Injectable()
export class TicketsRepository {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async create(
    createTicketDto: CreateTicketDto,
    user: User,
    replyTo: Ticket | null,
  ): Promise<Ticket> {
    const ticket = this.ticketRepository.create({ ...createTicketDto, user, replyTo });
    return this.ticketRepository.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepository
      .createQueryBuilder("tickets")
      .where("tickets.replyTo IS NULL")
      .getMany();
  }

  async findOne(id: number): Promise<Ticket | null> {
    return this.ticketRepository.findOne({ where: { id }, relations: ["replies", "replayTo"] });
  }

  async findByUserId(userId: number): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { user: { id: userId } },
      relations: ["replies", "replayTo"],
    });
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Ticket | null> {
    return this.ticketRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ["replies", "replayTo"],
    });
  }
}
