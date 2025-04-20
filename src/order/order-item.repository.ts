import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Product } from "../products/entities/product.entity";
import { OrderItem } from "./entities/order-item.entity";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(order: Order, product: Product): Promise<OrderItem> {
    const orderItem = this.orderItemRepository.create({ order, product });
    return this.orderItemRepository.save(orderItem);
  }
}
