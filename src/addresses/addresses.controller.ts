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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { AdminGuard } from "../auth/admin/admin.guard";
import { JwtAuthGuard } from "../auth/jwt-guard/jwt-guard.guard";
import { ResponseDto } from "../common/dto/response.dto";
import { AddressesService } from "./addresses.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

@ApiTags("Addresses")
@ApiBearerAuth()
@Controller({ path: "addresses", version: "1" })
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @ApiOperation({ summary: "Create a new address" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Address created successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @Post()
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

  @ApiOperation({ summary: "Get all addresses" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Addresses fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @Get()
  @UseGuards(AdminGuard)
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

  @ApiOperation({ summary: "Get my addresses" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Addresses fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
  @Get("me")
  async findMe(@Res() res: Response, @Req() req: Request): Promise<object> {
    const userId: number = req.user.id;
    const address = await this.addressesService.findByUserId(userId);

    return res.status(HttpStatus.OK).json({
      data: address,
      statusCode: HttpStatus.OK,
      message: "Address fetched successfully",
    });
  }

  @ApiOperation({ summary: "Get one address by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Address fetched successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Address not found" })
  @Get(":id")
  @UseGuards(AdminGuard)
  async findOne(@Res() res: Response, @Param("id", ParseIntPipe) id: number): Promise<object> {
    const address = await this.addressesService.findOne(id);

    return res.status(HttpStatus.OK).json({
      data: address,
      statusCode: HttpStatus.OK,
      message: "Address fetched successfully",
    });
  }

  @ApiOperation({ summary: "Update a address by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Address updated successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Address not found" })
  @ApiParam({ name: "id", type: "number", description: "Address id" })
  @Put(":id")
  @UseGuards(AdminGuard)
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

  @ApiOperation({ summary: "Delete a address by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Address deleted successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Address not found" })
  @ApiParam({ name: "id", type: "number", description: "Address id" })
  @Delete("me/:id")
  async removeMyAddress(
    @Req() req: Request,
    @Res() res: Response,
    @Param("id", ParseIntPipe) addressId: number,
  ): Promise<object> {
    const userId: number = req.user.id;
    await this.addressesService.deleteByAddressIdAndUserId(addressId, userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Address deleted successfully",
    });
  }

  @ApiOperation({ summary: "Delete a address by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Address deleted successfully",
    type: ResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Address not found" })
  @ApiParam({ name: "id", type: "number", description: "Address id" })
  @Delete(":id")
  @UseGuards(AdminGuard)
  async remove(@Res() res: Response, @Param("id", ParseIntPipe) id: number): Promise<object> {
    await this.addressesService.delete(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Address deleted successfully",
    });
  }
}
