import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { CreateLikeDto } from "./dto/create-like.dto";
import { Like } from "./entities/like.entity";
import { LikesRepository } from "./likes.repository";

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createLikeDto: CreateLikeDto, userId: number): Promise<Like> {
    const product = await this.productsService.findOne(createLikeDto.product);
    const user = await this.usersService.findOne(userId);
    await this.existingLike(createLikeDto.product);
    return this.likesRepository.create(product, user);
  }

  async existingLike(id: number): Promise<void> {
    const like = await this.likesRepository.findOne(id);
    if (like) throw new BadRequestException(`Like for product id ${id} already exists`);
  }

  async findAll(userId: number): Promise<Like[]> {
    return this.likesRepository.findAll(userId);
  }

  async delete(id: number, userId: number): Promise<void> {
    const user = await this.usersService.findOne(userId);
    const deleteResult = await this.likesRepository.delete(id, user);
    if (!deleteResult.affected) throw new NotFoundException(`Like id ${id} not found`);
  }
}
