import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../users/entities/user.entity";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { Address } from "./entities/address.entity";

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(userId: number, createAddressDto: CreateAddressDto): Promise<object> {
    const user = await this.usersRepository.findOneByOrFail({ id: userId });
    const newAddress = this.addressesRepository.create({ ...createAddressDto, user });

    return this.addressesRepository.save(newAddress);
  }

  findAll(limit: number = 10, page: number = 1): Promise<Address[]> {
    const query = this.addressesRepository.createQueryBuilder("addresses");

    query
      .skip((page - 1) * limit)
      .take(limit)
      .leftJoinAndSelect("addresses.user", "user");

    return query.getMany();
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressesRepository.findOne({ where: { id }, relations: ["user"] });

    if (!address) throw new NotFoundException(`Address with id ${id} not found.`);

    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id);

    if (!address) throw new NotFoundException(`Address with id ${id} not found.`);

    await this.addressesRepository.update({ id }, updateAddressDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.addressesRepository.delete({ id });

    if (!deleteResult.affected) throw new NotFoundException(`Address with id ${id} not found.`);
  }
}
