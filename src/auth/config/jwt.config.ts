import type { JwtModuleAsyncOptions } from "@nestjs/jwt";

import { ConfigModule, ConfigService } from "@nestjs/config";

export const JwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>("JWT_SECRET_KEY"),
    signOptions: { expiresIn: configService.get<string>("JWT_EXPIRATION") },
  }),
};
