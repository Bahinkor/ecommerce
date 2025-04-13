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
import { UpdatePasswordDto } from "./dto/update-password.dto";

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

  async getMe(userId: number): Promise<User> {
    return this.userService.findOne(userId);
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const user = await this.userService.findOneWithPassword(userId);
    const { currentPassword, newPassword } = updatePasswordDto;
    const { password } = user;

    if (currentPassword === newPassword) throw new BadRequestException("password is duplicate");

    const isMatchPassword: boolean = await bcrypt.compare(currentPassword, password);

    if (!isMatchPassword) throw new BadRequestException("password is not valid");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userService.forgetPassword(user.id, hashedPassword);
  }
}
