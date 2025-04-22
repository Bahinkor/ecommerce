import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Order } from "../../order/entities/order.entity";
import { PaymentStatus } from "../types/payment-status.enum";

@Entity("payment")
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint", name: "track_id" })
  trackId: number;

  @ManyToOne(() => Order, (order: Order) => order.payments)
  order: Order;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: "varchar", name: "payment_portal_url" })
  paymentPortalUrl: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
