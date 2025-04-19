import { InjectRedis } from "@nestjs-modules/ioredis";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import Redis from "ioredis";

import { User } from "../users/entities/user.entity";
import { UserRoleEnum } from "../users/enums/user-role.enum";
import { UsersService } from "../users/users.service";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    await this.usersService.ensurePhoneNotRegistered(registerDto.phoneNumber);
    return this.usersService.create({ ...registerDto, role: UserRoleEnum.NormalUser });
  }

  async login(loginDto: LoginDto): Promise<string> {
    const user: User = await this.usersService.findOneByPhoneNumber(loginDto.phoneNumber);
    const isMatchPassword: boolean = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatchPassword) throw new UnauthorizedException("password or phone number is not valid");
    const payload = { sub: user.id, displayName: user.displayName };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async getMe(userId: number): Promise<User> {
    return this.usersService.findOne(userId);
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const user = await this.usersService.findOneWithPassword(userId);
    const { currentPassword, newPassword } = updatePasswordDto;
    const { password } = user;

    if (currentPassword === newPassword) throw new BadRequestException("password is duplicate");

    const isMatchPassword: boolean = await bcrypt.compare(currentPassword, password);
    if (!isMatchPassword) throw new BadRequestException("password is not valid");

    const hashedPassword = this.usersService.hashPassword(newPassword);
    await this.usersService.updatePassword(user.id, hashedPassword);
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<void> {
    await this.usersService.findOneByPhoneNumber(forgetPasswordDto.phoneNumber);

    // generate otp password code (for test)
    const otpPassword = "111111";

    // send otp password to user phone number with sms panel api

    await this.redis.set(
      `otp:${forgetPasswordDto.phoneNumber}`,
      otpPassword,
      "EX",
      +(process.env.REDIS_EXPIRATION ?? "180"),
    ); // type: second
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findOneByPhoneNumber(resetPasswordDto.phoneNumber);
    const savedOptPasswordOnRedis = await this.redis.get(`otp:${resetPasswordDto.phoneNumber}`);
    if (resetPasswordDto.otpPassword !== savedOptPasswordOnRedis)
      throw new BadRequestException("otp password is invalid");

    const hashedPassword = this.usersService.hashPassword(resetPasswordDto.newPassword);
    await this.usersService.updatePassword(user.id, hashedPassword);
    await this.redis.del(`otp:${resetPasswordDto.phoneNumber}`);
  }
}
