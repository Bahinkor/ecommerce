import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    type: "string",
    example: "Comment text",
    maxLength: 5000,
    description: "Comment body",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  text: string;

  @ApiProperty({
    type: "number",
    example: 1,
    description: "product Id",
  })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ type: "number", example: 1, description: "Comment reply to", required: false })
  @IsNumber()
  @IsOptional()
  replayTo: number;
}
