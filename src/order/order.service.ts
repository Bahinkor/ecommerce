import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { Repository } from "typeorm";

import { AddressesService } from "../addresses/addresses.service";
import { ProductsService } from "../products/products.service";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderItem } from "./entities/order-item.entity";
import { Order } from "./entities/order.entity";
import { OrderStatusEnum } from "./enums/order-status.enum";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly usersService: UsersService,
    private readonly addressesService: AddressesService,
    private readonly productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, req: Request): Promise<Order> {
    const { userId } = req.user;
    const user: User = await this.usersService.findOne(userId);

    const { addressId, discountCode, items: orderItems } = createOrderDto;
    const address = await this.addressesService.findOne(addressId);

    const order = this.orderRepository.create({
      user,
      address,
      total_price: 100,
      discount_code: discountCode,
      status: OrderStatusEnum.PENDING,
      payed_time: new Date(),
      items: orderItems,
    });

    const savedOrder = await this.orderRepository.save(order);

    if (orderItems.length > 0) {
      const orderItems = createOrderDto.items.map(async (item) => {
        const product = await this.productsService.findOne(item.product.id);

        const orderItem = this.orderItemRepository.create({ order: savedOrder, product });

        return this.orderItemRepository.save(orderItem);
      });

      await Promise.all(orderItems);
    }

    return savedOrder;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
