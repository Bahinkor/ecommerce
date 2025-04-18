import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../users/entities/user.entity";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { Address } from "./entities/address.entity";

@Injectable()
export class AddressesRepository {
  constructor(
    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto, user: User): Promise<Address> {
    const newAddress = this.addressesRepository.create({ ...createAddressDto, user });
    return this.addressesRepository.save(newAddress);
  }

  async findAll(limit: number = 10, page: number = 1): Promise<Address[]> {
    const query = this.addressesRepository.createQueryBuilder("addresses");
    query
      .skip((page - 1) * limit)
      .take(limit)
      .leftJoinAndSelect("addresses.user", "user");

    return query.getMany();
  }

  async findOne(id: number): Promise<Address | null> {
    return this.addressesRepository.findOne({ where: { id }, relations: ["user"] });
  }

  async findByUserId(userId: number): Promise<Address[]> {
    return this.addressesRepository.find({ where: { user: { id: userId } } });
  }

  async findOneByAddressIdAndUserId(addressId: number, userId: number): Promise<Address | null> {
    return this.addressesRepository.findOne({ where: { id: addressId, user: { id: userId } } });
  }

  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<void> {
    await this.addressesRepository.update({ id }, updateAddressDto);
  }

  async delete(id: number): Promise<void> {
    await this.addressesRepository.delete({ id });
  }

  async remove(address: Address): Promise<void> {
    await this.addressesRepository.remove(address);
  }
}
