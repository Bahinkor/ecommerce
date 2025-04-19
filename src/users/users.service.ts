import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { Product } from "../products/entities/product.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserRoleEnum } from "./enums/user-role.enum";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = this.hashPassword(createUserDto.password);
    return this.usersRepository.create({ ...createUserDto, password: hashedPassword });
  }

  findAll(role?: UserRoleEnum, limit: number = 10, page: number = 1): Promise<User[]> {
    return this.usersRepository.findAll(role, limit, page);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.fineOne(id);
    if (!user) throw new NotFoundException(`User id ${id} not found`);
    return user;
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<User> {
    const user = await this.usersRepository.findOneByPhoneNumber(phoneNumber);
    if (!user) throw new NotFoundException(`User ${phoneNumber} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<object> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async addProductToBasket(userId: number, product: Product): Promise<User> {
    const user: User = await this.findOne(userId);
    user.basketItems.push(product);
    return this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const deleteResult = await this.usersRepository.delete(id);
    if (!deleteResult.affected) throw new NotFoundException(`User id ${id} not found`);
  }

  async findOneWithPassword(id: number): Promise<User> {
    const user = await this.usersRepository.findOneWithPassword(id);
    if (!user) throw new NotFoundException(`User id ${id} not found`);
    return user;
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    const user = await this.findOne(userId);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
  }

  hashPassword(password: string): string {
    return bcrypt.hash(password, 10);
  }

  async ensurePhoneNotRegistered(phoneNumber: string): Promise<void> {
    const user = await this.findOneByPhoneNumber(phoneNumber);
    if (user) throw new BadRequestException("Phone number already registered");
  }
}
