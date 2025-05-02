import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTicketDto {
  @ApiProperty({
    type: "string",
    example: "Ticket title",
    minLength: 1,
    description: "Ticket title",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: "string",
    example: "Ticket subject",
    minLength: 1,
    description: "Ticket subject",
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    type: "string",
    example: "Ticket body",
    minLength: 1,
    description: "Ticket description",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: "number",
    example: 1,
    description: "Reply to ticket id",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  replayTo: number;
}
