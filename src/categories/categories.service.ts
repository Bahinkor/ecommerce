import { Injectable, NotFoundException } from "@nestjs/common";

import { CategoriesRepository } from "./categories.repository";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.create(createCategoryDto);
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne(id);
    if (!category) throw new NotFoundException(`Category id ${id} is not found`);
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.categoriesRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const category: Category = await this.findOne(id);
    category.products = [];
    // Unlink all associated products to prevent foreign key constraint issues
    await this.categoriesRepository.save(category);
    // Remove the category from the database
    await this.categoriesRepository.remove(category);
  }
}
