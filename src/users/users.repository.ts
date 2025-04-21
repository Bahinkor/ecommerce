import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserRoleEnum } from "./enums/user-role.enum";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(role?: UserRoleEnum, limit: number = 10, page: number = 1): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder("users");
    if (role) {
      query.where("role = :role", { role });
    }

    query.addSelect("users.phone_number");
    // pagination
    query.skip((page - 1) * limit).take(limit);
    return query.getMany();
  }

  async fineOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ["basketItems", "addresses", "orders"],
    });
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.phone_number = :phoneNumber", { phoneNumber })
      .getOne();
  }

  async findOneWithPassword(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id }, select: { password: true } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update({ id }, updateUserDto);
  }

  async delete(id: number) {
    return this.userRepository.delete({ id });
  }
}
