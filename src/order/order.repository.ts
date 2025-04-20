import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Address } from "../addresses/entities/address.entity";
import { User } from "../users/entities/user.entity";
import { Order } from "./entities/order.entity";
import { OrderStatusEnum } from "./enums/order-status.enum";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(user: User, address: Address, discountCode?: string): Promise<Order> {
    const order = this.orderRepository.create({
      user,
      address,
      discountCode,
      status: OrderStatusEnum.PENDING,
      payedTime: new Date(),
    });
    return this.orderRepository.save(order);
  }

  async findOne(id: number): Promise<Order | null> {
    return this.orderRepository.findOne({ where: { id }, relations: ["items.product"] });
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ["user"] });
  }

  async findOneByIdAndUserId(id: number, userId: number): Promise<Order | null> {
    return this.orderRepository
      .createQueryBuilder("order")
      .where("order.id = :id", { id })
      .andWhere("order.userId = :userId", { userId })
      .leftJoinAndSelect("order.items", "order_items")
      .leftJoinAndSelect("order.address", "addresses")
      .leftJoinAndSelect("order.user", "users")
      .getOne();
  }

  async updateTotalPrice(id: number, totalPrice: number) {
    await this.orderRepository.update({ id }, { totalPrice });
  }
}
