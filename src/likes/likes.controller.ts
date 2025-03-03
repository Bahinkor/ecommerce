import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-guard/jwt-guard.guard";

import { CreateLikeDto } from "./dto/create-like.dto";
import { LikesService } from "./likes.service";

@Controller("likes")
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Req() req: Request, @Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto, req);
  }

  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.likesService.remove(+id);
  }
}
