import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { In, Repository } from "typeorm";

import { Category } from "../categories/entities/category.entity";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly usersService: UsersService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { title, description, price, stock, categoryIds } = createProductDto;

    const product = this.productRepository.create({ title, description, price, stock });

    if (categoryIds) {
      const categories: Category[] = await this.categoryRepository.findBy({ id: In(categoryIds) });
      product.categories = categories;
    }

    return this.productRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ["categories"] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["categories"],
    });

    if (!product) throw new NotFoundException(`Product id ${id} is not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const { title, description, price, stock, categoryIds } = updateProductDto;

    const product: Product = await this.findOne(id);

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;

    if (categoryIds) {
      const categories: Category[] = await this.categoryRepository.findBy({ id: In(categoryIds) });
      product.categories = categories;
    }

    return this.productRepository.save(product);
  }

  async addItemToBasket(productId: number, req: Request): Promise<void> {
    const { userId } = req.user;
    const product: Product = await this.findOne(productId);

    await this.usersService.addProductToBasket(userId, product);
  }

  async removeItemFromBasket(productId: number, req: Request): Promise<void> {
    const { userId } = req.user;
    const user: User = await this.usersService.findOne(userId);

    const productIndex = user.basket_items.findIndex((item) => item.id === productId);

    if (productIndex === -1) throw new NotFoundException(`Product id ${productId} not found`);

    user.basket_items.splice(productIndex, 1);

    await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const product: Product = await this.findOne(id);

    await this.productRepository.remove(product);
  }
}
