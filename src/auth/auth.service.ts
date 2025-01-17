import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
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

  async login(phoneNumber: string, password: string): Promise<object> {
    const user = await this.userService.findOneByPhoneNumber(phoneNumber);
    const isMatchPassword: boolean = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) throw new UnauthorizedException("password or phone number is not valid");

    const payload = {
      sub: user.id,
      phone_number: user.phone_number,
      display_name: user.display_name,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
