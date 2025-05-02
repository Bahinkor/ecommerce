import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

import { CreateOrderItem } from "./create-order-item.dto";

export class CreateOrderDto {
  @ApiProperty({ type: "number", example: 1, description: "Address id" })
  @IsNumber()
  addressId: number;

  @ApiProperty({ type: "string", example: "discount-code", description: "Discount code" })
  @IsString()
  @IsOptional()
  discountCode?: string;

  @ApiProperty({ type: CreateOrderItem, example: [{ productId: 1 }], description: "Order items" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItem)
  items: CreateOrderItem[];
}
