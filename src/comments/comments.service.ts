import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { clearPhoneNumber } from "../utils/clearPhoneNumber";
import { CommentsRepository } from "./comments.repository";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async create(userId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const user = await this.usersService.findOne(userId);
    const product = await this.productsService.findOne(createCommentDto.productId);

    let replayToComment: Comment | null = null;
    if (createCommentDto.replayTo) {
      replayToComment = await this.findOne(createCommentDto.replayTo);
      if (replayToComment.replayTo !== null)
        throw new BadRequestException("You are not allowed to reply to this comment.");
    }
    return this.commentsRepository.create(createCommentDto, user, product, replayToComment);
  }

  findAll(): Promise<Comment[]> {
    return this.commentsRepository.findAll();
  }

  async findCommentsByProductId(productId: number): Promise<Comment[]> {
    await this.productsService.findOne(productId);
    const comments = await this.commentsRepository.findCommentsByProductId(productId);
    // remove phone_number from user data
    clearPhoneNumber(comments);
    return comments;
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne(id);
    if (!comment) throw new NotFoundException(`Comment id ${id} is not found`);
    return comment;
  }

  async acceptComment(id: number): Promise<Comment> {
    const comment: Comment = await this.findOne(id);
    comment.isAccepted = true;
    return this.commentsRepository.save(comment);
  }

  async delete(id: number): Promise<void> {
    const comment: Comment = await this.findOne(id);
    comment.replies = [];
    // Unlink all associated replies to prevent foreign key constraint issues
    await this.commentsRepository.save(comment);
    // Remove the comment from the database
    await this.commentsRepository.remove(comment);
  }
}
