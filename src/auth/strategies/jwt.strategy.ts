import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from "../../users/entities/user.entity";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET_KEY"),
    });
  }

  async validate(payload: any) {
    if (!payload?.sub) {
      throw new UnauthorizedException("Invalid token");
    }

    const user: User | null = await this.usersService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    return {
      userId: user.id,
      phone_number: user.phoneNumber,
      display_name: user.displayName,
      role: user.role,
    };
  }
}
