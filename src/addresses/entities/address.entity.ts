import { IsNotEmpty, IsString, Length } from "class-validator";
import { Order } from "src/order/entities/order.entity";
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

@Entity({ name: "addresses" })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  province: string;

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
  receiver_phone_number: string;

  @Column({ nullable: true })
  descriptions: string;

  @ManyToOne(() => User, (user: User) => user.addresses)
  user: User;

  @OneToMany(() => Order, (order: Order) => order.address)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
