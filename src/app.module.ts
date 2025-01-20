import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AddressesModule } from "./addresses/addresses.module";
import { AuthModule } from "./auth/auth.module";
import { TicketsModule } from "./tickets/tickets.module";
import { UsersModule } from "./users/users.module";

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
  ],
})
export class AppModule {}
