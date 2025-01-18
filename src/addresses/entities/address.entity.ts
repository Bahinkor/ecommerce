import { IsNotEmpty, IsString, Length } from "class-validator";
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

@Entity({ name: "addresses" })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  privince: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Column({ length: 10 })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  postal_code: string;

  @Column({ length: 11 })
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  reciver_phone_number: string;

  @Column({ nullable: true })
  descriptions: string;

  @ManyToOne(() => User, (user: User) => user.addresses)
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
