import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { AddressesService } from "./addresses.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Controller({ path: "addresses", version: "1" })
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<object> {
    const userId: number = req.user.id;
    const createdAddress = await this.addressesService.create(userId, createAddressDto);

    return res.status(HttpStatus.CREATED).json({
      data: createdAddress,
      statusCode: HttpStatus.CREATED,
      message: "Address created successfully",
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
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

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async findMe(@Res() res: Response, @Req() req: Request): Promise<object> {
    const userId: number = req.user.id;
    const address = await this.addressesService.findOne(userId);

    return res.status(HttpStatus.OK).json({
      data: address,
      statusCode: HttpStatus.OK,
      message: "Address fetched successfully",
    });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findOne(@Res() res: Response, @Param("id", ParseIntPipe) id: number): Promise<object> {
    const address = await this.addressesService.findOne(id);

    return res.status(HttpStatus.OK).json({
      data: address,
      statusCode: HttpStatus.OK,
      message: "Address fetched successfully",
    });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Res() res: Response,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<object> {
    const updatedAddress = await this.addressesService.update(id, updateAddressDto);

    return res.status(HttpStatus.OK).json({
      data: updatedAddress,
      statusCode: HttpStatus.OK,
      message: "Address updated successfully",
    });
  }

  @Delete("me/:id")
  @UseGuards(JwtAuthGuard)
  async removeMe(
    @Req() req: Request,
    @Res() res: Response,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<object> {
    const userId: number = req.user.id;
    await this.addressesService.removeOwmAddress(id, userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Address deleted successfully",
    });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Res() res: Response, @Param("id", ParseIntPipe) id: number): Promise<object> {
    await this.addressesService.remove(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Address deleted successfully",
    });
  }
}
