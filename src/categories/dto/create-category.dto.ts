import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    type: "string",
    example: "Category Title",
    maxLength: 100,
    description: "Category title",
  })
  @IsString()
  @MaxLength(100)
  title: string;
}
