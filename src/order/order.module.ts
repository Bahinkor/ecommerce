import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AddressesModule } from "../addresses/addresses.module";
import { ProductsModule } from "../products/products.module";
import { UsersModule } from "../users/users.module";
import { OrderItem } from "./entities/order-item.entity";
import { Order } from "./entities/order.entity";
import { OrderItemRepository } from "./order-item.repository";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";
import { OrderService } from "./order.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UsersModule,
    AddressesModule,
    ProductsModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderItemRepository],
})
export class OrderModule {}
