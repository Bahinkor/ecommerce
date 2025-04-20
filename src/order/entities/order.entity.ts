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

  @Column({ type: "bigint", default: 0, name: "total_price" })
  totalPrice: number;

  @Column({ type: "varchar", nullable: true, name: "discount_code" })
  discountCode: string;

  @Column({ type: "enum", enum: OrderStatusEnum, default: OrderStatusEnum.PENDING })
  status: OrderStatusEnum;

  @Column({ type: "timestamp", name: "payed_time" })
  payedTime: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
