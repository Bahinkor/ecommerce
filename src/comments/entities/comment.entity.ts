import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Product } from "../../products/entities/product.entity";
import { User } from "../../users/entities/user.entity";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ default: false })
  is_accepted: boolean;

  @ManyToOne(() => User, (user: User) => user.comments)
  user: User;

  @ManyToOne(() => Product, (product: Product) => product.comments)
  product: Product;

  @ManyToOne(() => Comment, (comment: Comment) => comment.replies, { nullable: true })
  replay_to: Comment | null;

  @OneToMany(() => Comment, (comment: Comment) => comment.replay_to)
  replies: Comment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
