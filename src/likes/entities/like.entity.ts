import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("product_likes")
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.likes)
  user: User;

  @ManyToOne(() => Product, (product: Product) => product.likes)
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
