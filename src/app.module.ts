import { RedisModule } from "@nestjs-modules/ioredis";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { WinstonModule } from "nest-winston";

import { AddressesModule } from "./addresses/addresses.module";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { CommentsModule } from "./comments/comments.module";
import { throttlerConfigOptions } from "./common/config/throttler.config";
import { winstonConfigOptions } from "./common/config/winston-logger.config";
import { dataSourceOptions } from "./common/db/data-source";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { LikesModule } from "./likes/likes.module";
import { OrderModule } from "./order/order.module";
import { PaymentModule } from "./payment/payment.module";
import { ProductsModule } from "./products/products.module";
import { TicketsModule } from "./tickets/tickets.module";
import { UsersModule } from "./users/users.module";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config({ path: ".env" });
}

@Module({
  imports: [
    // configuration
    ConfigModule.forRoot({ isGlobal: true }),

    // rate limiter
    ThrottlerModule.forRoot(throttlerConfigOptions),

    // database connection
    TypeOrmModule.forRoot(dataSourceOptions),

    // logger configuration
    WinstonModule.forRoot(winstonConfigOptions),

    // redis
    RedisModule.forRoot({ type: "single", url: process.env.REDIS_HOST }),

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
    PaymentModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
