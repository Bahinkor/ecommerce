import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

import { OrderItem } from "../entities/order-item.entity";
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
  items: OrderItem[];
}
