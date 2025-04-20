import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Product } from "../products/entities/product.entity";
import { User } from "../users/entities/user.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: User,
    product: Product,
    replayTo: Comment | null,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({ ...createCommentDto, user, product, replayTo });
    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ["product", "user"] });
  }

  async findOne(id: number): Promise<Comment | null> {
    return this.commentRepository.findOne({ where: { id }, relations: ["product", "user"] });
  }

  async findCommentsByProductId(productId: number): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.replies", "reply", "reply.is_accepted = :isAccepted", {
        isAccepted: true,
      })
      .leftJoinAndSelect("comment.product", "product")
      .leftJoinAndSelect("comment.user", "user")
      .leftJoinAndSelect("reply.user", "replyUser")
      .where("comment.productId = :productId", { productId })
      .andWhere("comment.replay_to IS NULL")
      .andWhere("comment.is_accepted = true")
      .getMany();
  }

  async save(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  async remove(comment: Comment) {
    return this.commentRepository.remove(comment);
  }
}
