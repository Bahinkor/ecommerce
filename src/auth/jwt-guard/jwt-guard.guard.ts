import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: User | null, info: any) {
    if (err || !user) {
      const message = info?.message || "Invalid token";
      throw new UnauthorizedException(message);
    }
    return user;
  }
}
