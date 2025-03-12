import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductsModule } from "../products/products.module";
import { UsersModule } from "../users/users.module";
import { Like } from "./entities/like.entity";
import { LikesController } from "./likes.controller";
import { LikesService } from "./likes.service";

@Module({
  imports: [TypeOrmModule.forFeature([Like]), ProductsModule, UsersModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
