import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersModule } from "./users/users.module";
import { AuthModule } from './auth/auth.module';

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
  ],
})
export class AppModule {}
