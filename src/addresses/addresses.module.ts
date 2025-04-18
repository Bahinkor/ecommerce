import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersModule } from "../users/users.module";
import { AddressesController } from "./addresses.controller";
import { AddressesRepository } from "./addresses.repository";
import { AddressesService } from "./addresses.service";
import { Address } from "./entities/address.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Address]), UsersModule],
  controllers: [AddressesController],
  providers: [AddressesService, AddressesRepository],
  exports: [AddressesService],
})
export class AddressesModule {}
