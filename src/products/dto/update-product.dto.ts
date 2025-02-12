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
  @IsString()
  @MaxLength(100)
  @IsOptional()
  title: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  price: number;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  stock: number;

  @IsArray()
  @ArrayMaxSize(5)
  @IsInt({ each: true })
  @IsOptional()
  categoryIds?: number[];
}
