import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";

import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Res() res: Response, @Body() createCommentDto: CreateCommentDto) {
    const comment = await this.commentsService.create(createCommentDto);

    return res.status(HttpStatus.CREATED).json({
      data: comment,
      statusCode: HttpStatus.CREATED,
      message: "Comment created successfully",
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const comments = await this.commentsService.findAll();

    return res.status(HttpStatus.OK).json({
      data: comments,
      statusCode: HttpStatus.OK,
      message: "Comments fetched successfully",
    });
  }
}
