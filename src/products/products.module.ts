import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Category } from "../categories/entities/category.entity";
import { User } from "../users/entities/user.entity";
import { UsersModule } from "../users/users.module";
import { Product } from "./entities/product.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, User]), UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
