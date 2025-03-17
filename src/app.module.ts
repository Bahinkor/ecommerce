import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";

import { AddressesModule } from "./addresses/addresses.module";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { CommentsModule } from "./comments/comments.module";
import { LikesModule } from "./likes/likes.module";
import { ProductsModule } from "./products/products.module";
import { TicketsModule } from "./tickets/tickets.module";
import { UsersModule } from "./users/users.module";
import { OrderModule } from './order/order.module';

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config({ path: ".env" });
}

@Module({
  imports: [
    // configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // database connection
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [`${__dirname}/**/entities/*.entity{.ts,.js}`],
      synchronize: true,
    }),

    // modules
    UsersModule,
    AuthModule,
    AddressesModule,
    TicketsModule,
    ProductsModule,
    CategoriesModule,
    CommentsModule,
    LikesModule,
    OrderModule,
  ],
})
export class AppModule {}
