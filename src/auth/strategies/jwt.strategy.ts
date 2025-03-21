import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET_KEY"),
    });
  }

  validate(payload: any) {
    if (!payload?.sub) {
      throw new UnauthorizedException("Invalid token");
    }

    return {
      userId: payload.sub,
      phone_number: payload.phone_number,
      display_name: payload.display_name,
      role: payload.role,
    };
  }
}
