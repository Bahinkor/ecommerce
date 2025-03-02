import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AdminGuard } from "src/auth/admin/admin.guard";
import { JwtAuthGuard } from "src/auth/jwt-guard/jwt-guard.guard";

import { CreateLikeDto } from "./dto/create-like.dto";
import { LikesService } from "./likes.service";

@Controller("likes")
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto);
  }

  @Get()
  findAll() {
    console.log();
    return this.likesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.likesService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.likesService.remove(+id);
  }
}
