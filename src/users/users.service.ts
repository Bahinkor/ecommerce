import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import UserRoleEnum from "./enums/userRole.enum";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = this.userRepository.create(createUserDto);

      return await this.userRepository.save(newUser);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  findAll(role?: UserRoleEnum, limit: number = 10, page: number = 1): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder("users");

    if (role) {
      query.where("role = :role", { role });
    }

    // pagination
    query.skip((page - 1) * limit).take(limit);

    return query.getMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`User id ${id} not found`);

    return user;
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ phone_number: phoneNumber });

    if (!user) throw new NotFoundException(`User ${phoneNumber} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);

      if (!user) throw new NotFoundException(`User id ${id} not found`);

      await this.userRepository.update({ id }, updateUserDto);

      return await this.findOne(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.userRepository.delete({ id });

    if (!deleteResult.affected) throw new NotFoundException(`User id ${id} not found`);
  }
}
