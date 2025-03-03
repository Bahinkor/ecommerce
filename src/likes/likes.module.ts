import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "src/likes/entities/like.entity";
import { ProductsModule } from "src/products/products.module";
import { UsersModule } from "src/users/users.module";

import { LikesController } from "./likes.controller";
import { LikesService } from "./likes.service";

@Module({
  imports: [TypeOrmModule.forFeature([Like]), ProductsModule, UsersModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
