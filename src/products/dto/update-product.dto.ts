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

export class UpdateProductDto {
  @ApiProperty({
    type: "string",
    example: "Product title",
    minLength: 1,
    maxLength: 100,
    description: "Product title",
    required: false,
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  title: string;

  @ApiProperty({
    type: "number",
    example: 1000,
    minimum: 0,
    description: "Product price",
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  price: number;

  @ApiProperty({
    type: "string",
    example: "Product description",
    minLength: 1,
    maxLength: 1000,
    description: "Product description",
    required: false,
  })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description: string;

  @ApiProperty({
    type: "number",
    example: 10,
    minimum: 0,
    description: "Product stock",
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
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
  @IsInt({ each: true })
  @IsOptional()
  categoryIds?: number[];
}
