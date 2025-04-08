import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { Product } from "../products/entities/product.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserRoleEnum } from "./enums/user-role.enum";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword });

    return this.userRepository.save(newUser);
  }

  findAll(role?: UserRoleEnum, limit: number = 10, page: number = 1): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder("users");

    if (role) {
      query.where("role = :role", { role });
    }

    query.addSelect("users.phone_number");
    // pagination
    query.skip((page - 1) * limit).take(limit);

    return query.getMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["basket_items", "addresses", "orders"],
      select: { password: false },
    });

    if (!user) throw new NotFoundException(`User id ${id} not found`);

    return user;
  }

  async findOneByPhoneNumber(
    phoneNumber: string,
    checkExist: boolean = false,
  ): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.phone_number = :phoneNumber", { phoneNumber })
      .getOne();

    if (!user && !checkExist) throw new NotFoundException(`User ${phoneNumber} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<object> {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException(`User id ${id} not found`);

    return this.userRepository.update({ id }, updateUserDto);
  }

  async addProductToBasket(userId: number, product: Product): Promise<User> {
    const user: User = await this.findOne(userId);

    user.basket_items.push(product);

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.userRepository.delete({ id });

    if (!deleteResult.affected) throw new NotFoundException(`User id ${id} not found`);
  }
}
