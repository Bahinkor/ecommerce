import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { clearPhoneNumber } from "../utils/clearPhoneNumber";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { user_id, product_id, replay_to, ...commentData } = createCommentDto;
    const user = await this.usersService.findOne(user_id);
    const product = await this.productsService.findOne(product_id);

    let replayToComment: Comment | null = null;
    if (replay_to) {
      replayToComment = await this.commentRepository.findOne({
        where: { id: replay_to },
        relations: ["replay_to"],
      });

      if (!replayToComment) throw new NotFoundException(`Comment id ${replay_to} is not found`);
      if (replayToComment.replay_to !== null)
        throw new BadRequestException("You are not allowed to reply to this comment.");
    }

    const comment = this.commentRepository.create({
      ...commentData,
      user,
      product,
      replay_to: replayToComment,
    });

    return this.commentRepository.save(comment);
  }

  findAll(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ["product", "user"] });
  }

  async findProductComments(productId: number): Promise<Comment[]> {
    await this.productsService.findOne(productId);

    const comments = await this.commentRepository
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

    // remove phone_number from user data
    clearPhoneNumber(comments);

    return comments;
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) throw new NotFoundException(`Comment id ${id} is not found`);

    return comment;
  }

  async acceptComment(id: number): Promise<void> {
    const comment: Comment = await this.findOne(id);

    comment.is_accepted = true;
    await this.commentRepository.save(comment);
  }
}
