import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Address } from "../../addresses/entities/address.entity";
import { User } from "../../users/entities/user.entity";
import { OrderStatusEnum } from "../enums/order-status.enum";

@Entity("order")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.orders)
  user: User;

  @ManyToOne(() => Address, (address: Address) => address.orders)
  address: Address;

  @Column({ type: "bigint" })
  total_price: number;

  @Column({ type: "bigint", nullable: true })
  discount_code: number;

  @Column({ type: "enum", enum: OrderStatusEnum, default: OrderStatusEnum.PENDING })
  status: OrderStatusEnum;

  @Column()
  payed_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
