import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrderItem {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
