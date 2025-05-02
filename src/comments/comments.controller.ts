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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { ResponseDto } from "../common/dto/response.dto";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@ApiTags("Comments")
@Controller({ path: "comments", version: "1" })
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: "Create a new comment" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Comment created successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Product not found" })
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

  @ApiOperation({ summary: "Get all comments" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Comments fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: "Get all comments by product id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Comments fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Product not found" })
  @Get(":id")
  async findOne(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    const comments = await this.commentsService.findCommentsByProductId(id);

    return res.status(HttpStatus.OK).json({
      data: comments,
      statusCode: HttpStatus.OK,
      message: "Comments fetched successfully",
    });
  }

  @ApiOperation({ summary: "Accept a comment" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Comment accepted successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Comment not found" })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: "Delete a comment" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Comment deleted successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Comment not found" })
  @ApiBearerAuth()
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
