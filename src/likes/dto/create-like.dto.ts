import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateLikeDto {
  @ApiProperty({ type: "number", example: 1, description: "Product id" })
  @IsInt()
  @IsNotEmpty()
  product: number;
}
