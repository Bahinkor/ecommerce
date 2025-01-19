import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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
  reply_to: Ticket;

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.reply_to)
  replies: Ticket[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
