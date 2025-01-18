import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from "@nestjs/common";
import { Response } from "express";

import { AddressesService } from "./addresses.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Controller("addresses")
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async create(@Res() res: Response, @Body() createAddressDto: CreateAddressDto): Promise<object> {
    const createdAddress = await this.addressesService.create(createAddressDto);

    return res.status(HttpStatus.CREATED).json({
      data: createdAddress,
      statusCode: HttpStatus.CREATED,
      message: "Address created successfully",
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query("limit") limit: number = 10,
    @Query("page") page: number = 1,
  ): Promise<object> {
    const addresses = await this.addressesService.findAll(limit, page);

    return res.status(HttpStatus.OK).json({
      data: addresses,
      statusCode: HttpStatus.OK,
      message: "Addresses fetched successfully",
    });
  }

  @Get(":id")
  async findOne(@Res() res: Response, @Param("id") id: string): Promise<object> {
    const address = await this.addressesService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      data: address,
      statusCode: HttpStatus.OK,
      message: "Address fetched successfully",
    });
  }

  @Put(":id")
  async update(
    @Res() res: Response,
    @Param("id") id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<object> {
    const updatedAddress = await this.addressesService.update(+id, updateAddressDto);

    return res.status(HttpStatus.OK).json({
      data: updatedAddress,
      statusCode: HttpStatus.OK,
      message: "Address updated successfully",
    });
  }

  @Delete(":id")
  async remove(@Res() res: Response, @Param("id") id: string): Promise<object> {
    await this.addressesService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Address deleted successfully",
    });
  }
}
