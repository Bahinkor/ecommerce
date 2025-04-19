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

import { Address } from "../../addresses/entities/address.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { Like } from "../../likes/entities/like.entity";
import { Order } from "../../order/entities/order.entity";
import { Product } from "../../products/entities/product.entity";
import { Ticket } from "../../tickets/entities/ticket.entity";
import { UserRoleEnum } from "../enums/user-role.enum";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 35, name: "display_name" })
  displayName: string;

  @Column({ unique: true, length: 11, name: "phone_number" })
  phoneNumber?: string;

  @Column({ type: "varchar", select: false })
  password: string;

  @Column({ type: "enum", enum: UserRoleEnum, default: UserRoleEnum.NormalUser })
  role: UserRoleEnum;

  @OneToMany(() => Address, (address: Address) => address.user)
  addresses: Address[];

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.user)
  tickets: Ticket[];

  @OneToMany(() => Comment, (comment: Comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like: Like) => like.user)
  likes: Like[];

  @OneToMany(() => Order, (order: Order) => order.user)
  orders: Order[];

  @ManyToMany(() => Product, (product: Product) => product.baskets)
  @JoinTable({
    name: "basket_items",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "product_id", referencedColumnName: "id" },
  })
  basketItems: Product[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
