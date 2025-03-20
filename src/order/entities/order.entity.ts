import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Address } from "../../addresses/entities/address.entity";
import { User } from "../../users/entities/user.entity";
import { OrderStatusEnum } from "../enums/order-status.enum";
import { OrderItem } from "./order-item.entity";

@Entity("order")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.orders)
  user: User;

  @ManyToOne(() => Address, (address: Address) => address.orders)
  address: Address;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order)
  items: OrderItem[];

  @Column({ type: "bigint" })
  total_price: number;

  @Column({ type: "varchar", nullable: true })
  discount_code: string;

  @Column({ type: "enum", enum: OrderStatusEnum, default: OrderStatusEnum.PENDING })
  status: OrderStatusEnum;

  @Column({ type: "timestamp" })
  payed_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
