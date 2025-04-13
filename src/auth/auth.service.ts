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
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,

    @InjectRedis()
    private readonly redis: Redis,
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

    await this.userService.updatePassword(user.id, hashedPassword);
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<void> {
    const { phoneNumber } = forgetPasswordDto;
    await this.userService.findOneByPhoneNumber(phoneNumber);

    // generate otp password code (for test)
    const otpPassword = "111111";

    // send otp password to user phone number with sms panel api

    await this.redis.set(
      `otp:${phoneNumber}`,
      otpPassword,
      "EX",
      +(process.env.REDIS_EXPIRATION ?? "180"),
    ); // type: second
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { phoneNumber, otpPassword, newPassword } = resetPasswordDto;

    const user = await this.userService.findOneByPhoneNumber(phoneNumber);

    if (!user) throw new NotFoundException("user is not found");

    const savedOptPasswordOnRedis = await this.redis.get(`otp:${phoneNumber}`);

    if (otpPassword !== savedOptPasswordOnRedis)
      throw new BadRequestException("otp password is invalid");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userService.updatePassword(user.id, hashedPassword);
    await this.redis.del(phoneNumber);
  }
}
