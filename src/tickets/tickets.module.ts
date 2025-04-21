import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersModule } from "../users/users.module";
import { Ticket } from "./entities/ticket.entity";
import { TicketsController } from "./tickets.controller";
import { TicketsRepository } from "./tickets.repository";
import { TicketsService } from "./tickets.service";

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), UsersModule],
  controllers: [TicketsController],
  providers: [TicketsService, TicketsRepository],
})
export class TicketsModule {}
