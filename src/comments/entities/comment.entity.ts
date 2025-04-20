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

  @Column({ default: false, name: "is_accepted" })
  isAccepted: boolean;

  @ManyToOne(() => User, (user: User) => user.comments)
  user: User;

  @ManyToOne(() => Product, (product: Product) => product.comments)
  product: Product;

  @ManyToOne(() => Comment, (comment: Comment) => comment.replies, { nullable: true })
  replayTo: Comment | null;

  @OneToMany(() => Comment, (comment: Comment) => comment.replayTo)
  replies: Comment[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
