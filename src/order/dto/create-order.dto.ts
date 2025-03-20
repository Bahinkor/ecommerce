import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

import { CreateOrderItem } from "./create-order-item.dto";

export class CreateOrderDto {
  @IsNumber()
  addressId: number;

  @IsString()
  @IsOptional()
  discountCode?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItem)
  items: CreateOrderItem[];
}
