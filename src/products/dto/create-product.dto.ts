import { IsArray, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsArray()
  @MaxLength(5)
  @IsOptional()
  categoryIds?: number[];
}
