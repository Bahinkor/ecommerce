import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    type: "string",
    example: "Product title",
    minLength: 1,
    maxLength: 100,
    description: "Product title",
  })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    type: "number",
    example: 1000,
    minimum: 0,
    description: "Product price",
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({
    type: "string",
    example: "Product description",
    minLength: 1,
    maxLength: 1000,
    description: "Product description",
  })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    type: "number",
    example: 10,
    minimum: 0,
    description: "Product stock",
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    type: "array",
    example: [1, 2, 3],
    description: "Product category ids",
    required: false,
    maxLength: 5,
  })
  @IsArray()
  @ArrayMaxSize(5)
  @IsOptional()
  categoryIds?: number[];
}
