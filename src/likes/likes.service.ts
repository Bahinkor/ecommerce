import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { Like } from "src/likes/entities/like.entity";
import { ProductsService } from "src/products/products.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";

import { CreateLikeDto } from "./dto/create-like.dto";

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    // services
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createLikeDto: CreateLikeDto, req: Request): Promise<Like> {
    const { product: productId } = createLikeDto;
    const { userId } = req.user;

    const product = await this.productsService.findOne(productId);
    const user = await this.usersService.findOne(userId);

    await this.existingLike(productId);

    const newLike = this.likeRepository.create({ product, user });

    return this.likeRepository.save(newLike);
  }

  async existingLike(id: number): Promise<void> {
    const like = await this.likeRepository.findOne({ where: { id } });
    if (like) throw new BadRequestException(`Like for product id ${id} already exists`);
  }

  async findAll(req: Request): Promise<Like[]> {
    const { userId } = req.user;

    const query = this.likeRepository.createQueryBuilder("likes");

    query.where("likes.user = :userId", { userId });
    query.leftJoinAndSelect("likes.product", "product");

    return query.getMany();
  }

  async remove(id: number, req: Request): Promise<void> {
    const { userId } = req.user;
    const user = await this.usersService.findOne(userId);

    const deleteResult = await this.likeRepository.delete({ id, user });

    if (!deleteResult.affected) throw new NotFoundException(`Like id ${id} not found`);
  }
}
