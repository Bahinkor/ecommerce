import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Product } from "../../products/entities/product.entity";
import { Order } from "./order.entity";

@Entity("order_item")
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order: Order) => order.items)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;
}
