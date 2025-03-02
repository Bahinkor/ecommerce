import { Injectable } from "@nestjs/common";

import { CreateLikeDto } from "./dto/create-like.dto";

@Injectable()
export class LikesService {
  create(createLikeDto: CreateLikeDto) {
    return "This action adds a new like";
  }

  findAll() {
    return `This action returns all likes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}
