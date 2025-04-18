import { Injectable, NotFoundException } from "@nestjs/common";

import { UsersService } from "../users/users.service";
import { AddressesRepository } from "./addresses.repository";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { Address } from "./entities/address.entity";

@Injectable()
export class AddressesService {
  constructor(
    private readonly addressesRepository: AddressesRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, createAddressDto: CreateAddressDto): Promise<object> {
    const user = await this.usersService.findOne(userId);
    return this.addressesRepository.create(createAddressDto, user);
  }

  findAll(limit: number = 10, page: number = 1): Promise<Address[]> {
    return this.addressesRepository.findAll(limit, page);
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressesRepository.findOne(id);
    if (!address) throw new NotFoundException(`Address with id ${id} not found.`);
    return address;
  }

  async findByUserId(userId: number): Promise<Address[]> {
    return this.addressesRepository.findByUserId(userId);
  }

  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    await this.findOne(id);
    await this.addressesRepository.update(id, updateAddressDto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.addressesRepository.delete(id);
  }

  async deleteByAddressIdAndUserId(id: number, userId: number): Promise<void> {
    const address = await this.addressesRepository.findOneByAddressIdAndUserId(id, userId);
    if (!address) throw new NotFoundException(`Address with id ${id} not found.`);
    await this.addressesRepository.remove(address);
  }
}
