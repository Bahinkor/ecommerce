import { IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  title: string;
}
