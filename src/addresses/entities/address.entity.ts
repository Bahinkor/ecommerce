import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Order } from "../../order/entities/order.entity";
import { User } from "../../users/entities/user.entity";

@Entity({ name: "addresses" })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ length: 10 })
  postal_code: string;

  @Column({ length: 11 })
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
