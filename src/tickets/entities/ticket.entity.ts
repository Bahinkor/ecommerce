import { IsNotEmpty, IsString } from "class-validator";
// eslint-disable-next-line import/no-cycle
import { User } from "src/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
