import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { User } from "../users/entities/user.entity";
import { UserRoleEnum } from "../users/enums/user-role.enum";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const isUserExist = await this.userService.findOneByPhoneNumber(registerDto.phone_number, true);

    if (isUserExist) throw new BadRequestException("User already exists");

    await this.userService.create({
      ...registerDto,
      role: UserRoleEnum.NormalUser,
    });
  }

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userService.findOneByPhoneNumber(loginDto.phone_number);

    if (!user) throw new NotFoundException("User is not found");

    const isMatchPassword: boolean = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatchPassword) throw new UnauthorizedException("password or phone number is not valid");

    const payload = {
      sub: user.id,
      display_name: user.display_name,
    };
    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  async getMe(accessToken: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(accessToken);
      const userId = payload.sub;
      return await this.userService.findOne(userId);
    } catch (eer) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
