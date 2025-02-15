import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "src/products/products.module";
import { UsersModule } from "src/users/users.module";

import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { Comment } from "./entities/comment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, ProductsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
