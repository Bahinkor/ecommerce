import { IsNotEmpty, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "../../users/entities/user.entity";

@Entity({ name: "tickets" })
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ManyToOne(() => User, (user: User) => user.tickets)
  user: User;

  @ManyToOne(() => Ticket, (ticket: Ticket) => ticket.replies, { nullable: true })
  replyTo: Ticket | null;

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.replyTo)
  replies: Ticket[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
