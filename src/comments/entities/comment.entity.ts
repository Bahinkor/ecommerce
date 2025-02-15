import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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
