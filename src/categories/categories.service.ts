import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ["products"] });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["products"],
    });

    if (!category) throw new NotFoundException(`Category id ${id} is not found`);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.findOne(id);

    await this.categoryRepository.update({ id }, updateCategoryDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const category: Category = await this.findOne(id);
    category.products = [];

    // Unlink all associated products to prevent foreign key constraint issues
    await this.categoryRepository.save(category);
    // Remove the category from the database
    await this.categoryRepository.remove(category);
  }
}
