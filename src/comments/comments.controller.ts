import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userId: number = req.user.id;
    const comment = await this.commentsService.create(userId, createCommentDto);

    return res.status(HttpStatus.CREATED).json({
      data: comment,
      statusCode: HttpStatus.CREATED,
      message: "Comment created successfully",
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findAll(@Res() res: Response) {
    const comments = await this.commentsService.findAll();

    return res.status(HttpStatus.OK).json({
      data: comments,
      statusCode: HttpStatus.OK,
      message: "Comments fetched successfully",
    });
  }

  @Get(":id")
  async findOne(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    const comments = await this.commentsService.findCommentsByProductId(id);

    return res.status(HttpStatus.OK).json({
      data: comments,
      statusCode: HttpStatus.OK,
      message: "Comments fetched successfully",
    });
  }

  @Patch("/accept/:id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async acceptComment(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    const comment = await this.commentsService.acceptComment(id);

    return res.status(HttpStatus.OK).json({
      data: comment,
      statusCode: HttpStatus.OK,
      message: "Comment accepted successfully",
    });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    await this.commentsService.delete(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Comment removed successfully",
    });
  }
}
