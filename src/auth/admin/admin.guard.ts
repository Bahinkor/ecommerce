import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    if (!user) throw new UnauthorizedException("You must be logged in to access this resource");

    if (user.role !== "admin")
      throw new UnauthorizedException("You must be an admin to access this resource");

    return true;
  }
}
