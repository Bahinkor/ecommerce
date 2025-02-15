import { MaxLength, Min } from "class-validator";
import { Category } from "src/categories/entities/category.entity";
import { Comment } from "src/comments/entities/comment.entity";
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Category, (category: Category) => category.products)
  @JoinTable({
    name: "product_categories",
    joinColumns: [{ name: "product_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "category_id", referencedColumnName: "id" }],
  })
  categories: Category[];
}
