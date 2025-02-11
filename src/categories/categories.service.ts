import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) throw new NotFoundException(`Category id ${id} is not found`);

    await this.categoryRepository.update({ id }, updateCategoryDto);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.categoryRepository.delete({ id });

    if (!deleteResult.affected) throw new NotFoundException(`Category with id ${id} not found.`);
  }
}
