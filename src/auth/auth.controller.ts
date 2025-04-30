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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { ResponseDto } from "../common/dto/response.dto";
import { User } from "../users/entities/user.entity";
import { AuthService } from "./auth.service";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { JwtAuthGuard } from "./jwt-guard/jwt-guard.guard";

@ApiTags("Auth")
@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User created successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @Post("register")
  async register(@Res() res: Response, @Body() registerDto: RegisterDto): Promise<object> {
    const user: User = await this.authService.register(registerDto);

    return res.status(HttpStatus.CREATED).json({
      data: user,
      statusCode: HttpStatus.CREATED,
      message: "User created successfully",
    });
  }

  @ApiOperation({ summary: "Login user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User signed successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized (username ot password not correct)",
  })
  @Post("login")
  async login(@Res() res: Response, @Body() loginDto: LoginDto): Promise<object> {
    const user: string = await this.authService.login(loginDto);

    return res.status(HttpStatus.OK).json({
      data: user,
      statusCode: HttpStatus.OK,
      message: "User signed successfully",
    });
  }

  @ApiOperation({ summary: "Get current user info" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Data fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: "Update current user password" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password updated successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: "Forget user password" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Send otp password successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
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

  @ApiOperation({ summary: "Reset user password" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User password reset successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
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
