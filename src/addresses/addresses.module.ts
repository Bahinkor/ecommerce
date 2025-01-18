import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";

import { AddressesController } from "./addresses.controller";
import { AddressesService } from "./addresses.service";
import { Address } from "./entities/address.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Address, User])],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
