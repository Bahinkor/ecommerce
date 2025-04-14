import { RedisModule } from "@nestjs-modules/ioredis";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";

import { AddressesModule } from "./addresses/addresses.module";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { CommentsModule } from "./comments/comments.module";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { LikesModule } from "./likes/likes.module";
import { OrderModule } from "./order/order.module";
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // rate limiter
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
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

    // logger configuration
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),

        new winston.transports.File({
          filename: "logs/app.log",
          level: "info",
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),

        new winston.transports.File({
          filename: "logs/requests.log",
          level: "http",
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),

        new winston.transports.File({
          filename: "logs/errors.log",
          level: "error",
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      ],
    }),

    // redis
    RedisModule.forRoot({
      type: "single",
      url: process.env.REDIS_HOST,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
