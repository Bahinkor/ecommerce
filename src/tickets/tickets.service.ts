import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";

import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { Ticket } from "./entities/ticket.entity";

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    try {
      const { user_id, replay_to, ...ticketData } = createTicketDto;
      const user = await this.userService.findOne(user_id);

      let replayToTicket: Ticket | null = null;
      if (replay_to) {
        replayToTicket = await this.ticketRepository.findOneOrFail({
          where: { id: replay_to },
          relations: ["reply_to"],
        });
        if (replayToTicket.reply_to !== null)
          throw new BadRequestException("You are not allowed to reply to this ticket.");
      }

      const newTicket = this.ticketRepository.create({
        ...ticketData,
        user,
        reply_to: replayToTicket,
      });

      return await this.ticketRepository.save(newTicket);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  findAll(): Promise<Ticket[]> {
    return this.ticketRepository
      .createQueryBuilder("tickets")
      .where("tickets.reply_to IS NULL")
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
