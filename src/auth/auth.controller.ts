import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";

import { User } from "../users/entities/user.entity";
import { AuthService } from "./auth.service";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { JwtAuthGuard } from "./jwt-guard/jwt-guard.guard";

@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Res() res: Response, @Body() registerDto: RegisterDto): Promise<object> {
    const user: User = await this.authService.register(registerDto);

    return res.status(HttpStatus.CREATED).json({
      data: user,
      statusCode: HttpStatus.CREATED,
      message: "User created successfully",
    });
  }

  @Post("login")
  async login(@Res() res: Response, @Body() loginDto: LoginDto): Promise<object> {
    const user: string = await this.authService.login(loginDto);

    return res.status(HttpStatus.OK).json({
      data: user,
      statusCode: HttpStatus.OK,
      message: "User signed successfully",
    });
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request, @Res() res: Response): Promise<object> {
    const userId: number = req.user.id;
    const user = await this.authService.getMe(userId);

    return res.status(HttpStatus.OK).json({
      data: user,
      statusCode: HttpStatus.OK,
      message: "User signed successfully",
    });
  }

  @Patch("update-password")
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<object> {
    const userId: number = req.user.id;
    await this.authService.updatePassword(userId, updatePasswordDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Password update successfully",
    });
  }

  @Get("forget-password")
  async forgetPassword(
    @Res() res: Response,
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<object> {
    await this.authService.forgetPassword(forgetPasswordDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Send otp password successfully",
    });
  }

  @Patch("reset-password")
  async resetPassword(
    @Res() res: Response,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<object> {
    await this.authService.resetPassword(resetPasswordDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "User password reset successfully",
    });
  }
}
