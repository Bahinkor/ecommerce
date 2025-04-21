import { MaxLength, Min } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Category } from "../../categories/entities/category.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { Like } from "../../likes/entities/like.entity";
import { User } from "../../users/entities/user.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @MaxLength(100)
  @Column({ length: 100 })
  title: string;

  @MaxLength(1000)
  @Column({ length: 1000 })
  description: string;

  @Min(0)
  @Column()
  price: number;

  @Min(0)
  @Column()
  stock: number;

  @OneToMany(() => Comment, (comment: Comment) => comment.product)
  comments: Comment[];

  @OneToMany(() => Like, (like: Like) => like.product)
  likes: Like[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToMany(() => Category, (category: Category) => category.products)
  @JoinTable({
    name: "product_categories",
    joinColumns: [{ name: "product_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "category_id", referencedColumnName: "id" }],
  })
  categories: Category[];

  @ManyToMany(() => User, (user: User) => user.basketItems)
  baskets: User[];
}
