import { IsNotEmpty, IsString, Length } from "class-validator";
import { Address } from "src/addresses/entities/address.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Like } from "src/likes/entities/like.entity";
import { Ticket } from "src/tickets/entities/ticket.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import UserRoleEnum from "../enums/userRole.enum";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 35 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 35)
  display_name: string;

  @Column({ unique: true, length: 11 })
  @IsString()
  @Length(11, 11)
  phone_number?: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ type: "enum", enum: UserRoleEnum, default: UserRoleEnum.NormalUser })
  role: UserRoleEnum;

  @OneToMany(() => Address, (address: Address) => address.user)
  addresses: Address[];

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.user)
  tickets: Ticket[];

  @OneToMany(() => Comment, (comment: Comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like: Like) => like.user)
  likes: Like[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
