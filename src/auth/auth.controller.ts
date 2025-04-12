import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./jwt-guard/jwt-guard.guard";

@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Res() res: Response, @Body() registerDto: RegisterDto): Promise<object> {
    await this.authService.register(registerDto);

    return res.status(HttpStatus.CREATED).json({
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

  @Get("for-get-password")
  @UseGuards(JwtAuthGuard)
  async getPassword(@Req() req: Request, @Res() res: Response): Promise<object> {
    return {};
  }
}
