import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Res() res: Response, @Body() registerDto: RegisterDto): Promise<object> {
    const newUser = await this.authService.register(registerDto);

    return res.status(HttpStatus.CREATED).json({
      data: { ...newUser, password: null },
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
}
