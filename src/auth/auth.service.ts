import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "src/users/entities/user.entity";
import UserRoleEnum from "src/users/enums/userRole.enum";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(phoneNumber: string, password: string, displayName: string): Promise<User> {
    try {
      const hashedPassword: string = await bcrypt.hash(password, 10);

      return await this.userService.create({
        display_name: displayName,
        phone_number: phoneNumber,
        password: hashedPassword,
        role: UserRoleEnum.NormalUser,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
