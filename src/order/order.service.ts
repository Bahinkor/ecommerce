import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AddressesService } from "../addresses/addresses.service";
import { ProductsService } from "../products/products.service";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { CreateOrderDto } from "./dto/create-order.dto";
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

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const user: User = await this.usersService.findOne(userId);

    const { addressId, discountCode, items: orderItems } = createOrderDto;
    const address = await this.addressesService.findOne(addressId);

    const order = this.orderRepository.create({
      user,
      address,
      discount_code: discountCode,
      status: OrderStatusEnum.PENDING,
      payed_time: new Date(),
    });

    const savedOrder = await this.orderRepository.save(order);

    let totalPrice = 0;
    if (orderItems.length > 0) {
      const orderItemsEntities = await Promise.all(
        orderItems.map(async (item) => {
          const product = await this.productsService.findOne(item.productId);
          const orderItem = this.orderItemRepository.create({ order: savedOrder, product });
          totalPrice += product.price;
          return this.orderItemRepository.save(orderItem);
        }),
      );
    }

    await this.orderRepository.update({ id: savedOrder.id }, { total_price: totalPrice });

    const finalOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ["items.product"],
    });

    if (!finalOrder) throw new NotFoundException("Order not found");

    return finalOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ["user"] });
  }

  async findOne(id: number, userId: number): Promise<Order> {
    const query = this.orderRepository
      .createQueryBuilder("order")
      .where("order.id = :id", { id })
      .andWhere("order.userId = :userId", { userId })
      .leftJoinAndSelect("order.items", "order_items")
      .leftJoinAndSelect("order.address", "addresses")
      .leftJoinAndSelect("order.user", "users");

    const order = await query.getOne();

    if (!order) throw new NotFoundException("Order not found");

    return order;
  }
}
