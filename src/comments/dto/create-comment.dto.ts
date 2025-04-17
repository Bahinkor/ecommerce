import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  text: string;

  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNumber()
  @IsOptional()
  replay_to: number;
}
