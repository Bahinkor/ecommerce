import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Product } from "../products/entities/product.entity";
import { User } from "../users/entities/user.entity";
import { Like } from "./entities/like.entity";

@Injectable()
export class LikesRepository {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async create(product: Product, user: User): Promise<Like> {
    const like = this.likeRepository.create({ product, user });
    return this.likeRepository.save(like);
  }

  async findAll(userId: number): Promise<Like[]> {
    const query = this.likeRepository.createQueryBuilder("likes");
    query.where("likes.user = :userId", { userId });
    query.leftJoinAndSelect("likes.product", "product");
    return query.getMany();
  }

  async findOne(id: number): Promise<Like | null> {
    return this.likeRepository.findOne({ where: { id } });
  }

  async delete(id: number, user: User) {
    return this.likeRepository.delete({ id, user });
  }
}
