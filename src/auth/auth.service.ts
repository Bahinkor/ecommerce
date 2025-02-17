import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "src/users/entities/user.entity";
import UserRoleEnum from "src/users/enums/userRole.enum";
import { UsersService } from "src/users/users.service";

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const isUserExist = await this.userService.findOneByPhoneNumber(
        registerDto.phone_number,
        true,
      );

      if (isUserExist) throw new BadRequestException("User already exists");

      const hashedPassword: string = await bcrypt.hash(registerDto.password, 10);

      return await this.userService.create({
        ...registerDto,
        password: hashedPassword,
        role: UserRoleEnum.NormalUser,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userService.findOneByPhoneNumber(loginDto.phone_number);

    if (!user) throw new NotFoundException("User is not found");

    const isMatchPassword: boolean = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatchPassword) throw new UnauthorizedException("password or phone number is not valid");

    const payload = {
      sub: user.id,
      phone_number: user.phone_number,
      display_name: user.display_name,
    };
    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }
}
