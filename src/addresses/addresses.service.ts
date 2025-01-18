import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

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

  async create(createAddressDto: CreateAddressDto, userId: number): Promise<Address> {
    try {
      const user = await this.usersRepository.findOneByOrFail({ id: userId });
      const newAddress = this.addressesRepository.create({ ...createAddressDto, user });

      return await this.addressesRepository.save(newAddress);
    } catch (e) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }
  }

  findAll(): Promise<Address[]> {
    return this.addressesRepository.find({ relations: ["user"] });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressesRepository.findOne({ where: { id }, relations: ["user"] });

    if (!address) throw new NotFoundException(`Address with id ${id} not found.`);

    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    try {
      const address = await this.findOne(id);

      if (!address) throw new NotFoundException(`Address with id ${id} not found.`);

      await this.addressesRepository.update({ id }, updateAddressDto);

      return await this.findOne(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.addressesRepository.delete({ id });

    if (!deleteResult.affected) throw new NotFoundException(`Address with id ${id} not found.`);
  }
}
