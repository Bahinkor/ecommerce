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

  @Column({ name: "postal_code", length: 10 })
  postalCode: string;

  @Column({ name: "receiver_phone_number", length: 11 })
  receiverPhoneNumber: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user: User) => user.addresses)
  user: User;

  @OneToMany(() => Order, (order: Order) => order.address)
  orders: Order[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
