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
import { Request, Response } from "express";

import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { CreateLikeDto } from "./dto/create-like.dto";
import { LikesService } from "./likes.service";

@Controller("likes")
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  async create(@Req() req: Request, @Res() res: Response, @Body() createLikeDto: CreateLikeDto) {
    const newLike = await this.likesService.create(createLikeDto, req);

    return res.status(HttpStatus.CREATED).json({
      data: newLike,
      statusCode: HttpStatus.CREATED,
      message: "Like created successfully",
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    const likes = await this.likesService.findAll(req);

    return res.status(HttpStatus.OK).json({
      data: likes,
      statusCode: HttpStatus.OK,
      message: "Likes fetched successfully",
    });
  }

  @Delete(":id")
  async remove(@Res() res: Response, @Req() req: Request, @Param("id", ParseIntPipe) id: number) {
    await this.likesService.remove(id, req);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Like removed successfully",
    });
  }
}
