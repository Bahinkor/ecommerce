import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest<TUser = any>(
    err: any,
    user: User | null,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      const message = info?.message || "Invalid token";
      throw new UnauthorizedException(message);
    }
    return user as TUser;
  }
}
