import { Injectable, NotFoundException } from "@nestjs/common";

import { AddressesService } from "../addresses/addresses.service";
import { ProductsService } from "../products/products.service";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "./entities/order.entity";
import { OrderItemRepository } from "./order-item.repository";
import { OrderRepository } from "./order.repository";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly usersService: UsersService,
    private readonly addressesService: AddressesService,
    private readonly productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const user: User = await this.usersService.findOne(userId);
    const { addressId, discountCode, items: orderItems } = createOrderDto;
    const address = await this.addressesService.findOne(addressId);
    const order = await this.orderRepository.create(user, address, discountCode);

    let totalPrice = 0;
    if (orderItems.length > 0) {
      await Promise.all(
        orderItems.map(async (item) => {
          const product = await this.productsService.findOne(item.productId);
          totalPrice += product.price;
          return this.orderItemRepository.create(order, product);
        }),
      );
    }

    await this.orderRepository.updateTotalPrice(order.id, totalPrice);
    const finalOrder = await this.orderRepository.findOne(order.id);
    if (!finalOrder) throw new NotFoundException("Order not found");
    return finalOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async findOneByIdAndUserId(id: number, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOneByIdAndUserId(id, userId);
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }
}
