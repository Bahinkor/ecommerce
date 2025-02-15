import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
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

  @Get(":id")
  async findOne(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    const comments = await this.commentsService.findProductComments(id);

    return res.status(HttpStatus.OK).json({
      data: comments,
      statusCode: HttpStatus.OK,
      message: "Comments fetched successfully",
    });
  }

  @Patch("/accept/:id")
  async acceptComment(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    await this.commentsService.acceptComment(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Comment accepted successfully",
    });
  }
}
