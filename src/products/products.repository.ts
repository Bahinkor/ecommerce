import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Category } from "../categories/entities/category.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, categories: Category[]): Promise<Product> {
    const product = this.productRepository.create({ ...createProductDto, categories });
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ["categories"] });
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id }, relations: ["categories"] });
  }

  async save(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  async remove(product: Product) {
    await this.productRepository.remove(product);
  }
}
