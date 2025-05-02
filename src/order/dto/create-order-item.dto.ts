import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrderItem {
  @ApiProperty({ type: "number", example: 1, description: "Product id" })
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
