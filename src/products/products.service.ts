import { Injectable, NotFoundException } from "@nestjs/common";

import { CategoriesRepository } from "../categories/categories.repository";
import { Category } from "../categories/entities/category.entity";
import { User } from "../users/entities/user.entity";
import { UsersRepository } from "../users/users.repository";
import { UsersService } from "../users/users.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";
import { ProductsRepository } from "./products.repository";

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    let productCategories: Category[] = [];
    if (createProductDto.categoryIds) {
      const categories: Category[] = await this.categoriesRepository.findByIds(
        createProductDto.categoryIds,
      );
      productCategories = categories;
    }
    return this.productsRepository.create(createProductDto, productCategories);
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.findAll();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne(id);
    if (!product) throw new NotFoundException(`Product id ${id} is not found`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product: Product = await this.findOne(id);

    if (updateProductDto.title) product.title = updateProductDto.title;
    if (updateProductDto.description) product.description = updateProductDto.description;
    if (updateProductDto.price) product.price = updateProductDto.price;
    if (updateProductDto.stock) product.stock = updateProductDto.stock;
    if (updateProductDto.categoryIds) {
      const categories: Category[] = await this.categoriesRepository.findByIds(
        updateProductDto.categoryIds,
      );
      product.categories = categories;
    }

    return this.productsRepository.save(product);
  }

  async addItemToBasket(productId: number, userId: number): Promise<void> {
    const product: Product = await this.findOne(productId);
    await this.usersService.addProductToBasket(userId, product);
  }

  async removeItemFromBasket(productId: number, userId: number): Promise<void> {
    const user: User = await this.usersService.findOne(userId);
    const productIndex = user.basketItems.findIndex((item) => item.id === productId);
    if (productIndex === -1) throw new NotFoundException(`Product id ${productId} not found`);
    user.basketItems.splice(productIndex, 1);
    await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const product: Product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
}
