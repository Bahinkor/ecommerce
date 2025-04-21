import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsOptional()
  replayTo: number;
}
