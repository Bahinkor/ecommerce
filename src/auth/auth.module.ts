import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtConfig } from "./config/jwt.config";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [UsersModule, PassportModule, JwtModule.registerAsync(JwtConfig)],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
