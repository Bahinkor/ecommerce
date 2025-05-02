import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { ResponseDto } from "../common/dto/response.dto";
import { CreateLikeDto } from "./dto/create-like.dto";
import { LikesService } from "./likes.service";

@ApiTags("Likes")
@ApiBearerAuth()
@Controller({ path: "likes", version: "1" })
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({ summary: "Create a new like" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Like created successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Product not found" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
  @Post()
  async create(@Req() req: Request, @Res() res: Response, @Body() createLikeDto: CreateLikeDto) {
    const userId: number = req.user.id;
    const newLike = await this.likesService.create(createLikeDto, userId);

    return res.status(HttpStatus.CREATED).json({
      data: newLike,
      statusCode: HttpStatus.CREATED,
      message: "Like created successfully",
    });
  }

  @ApiOperation({ summary: "Get all likes by user id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Likes fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    const userId: number = req.user.id;
    const likes = await this.likesService.findAll(userId);

    return res.status(HttpStatus.OK).json({
      data: likes,
      statusCode: HttpStatus.OK,
      message: "Likes fetched successfully",
    });
  }

  @ApiOperation({ summary: "Delete a like" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Like deleted successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Product not found" })
  @Delete(":id")
  async remove(@Res() res: Response, @Req() req: Request, @Param("id", ParseIntPipe) id: number) {
    const userId: number = req.user.id;
    await this.likesService.delete(id, userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Like removed successfully",
    });
  }
}
