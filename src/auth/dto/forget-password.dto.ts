import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class ForgetPasswordDto {
  @ApiProperty({
    type: "string",
    example: "09123456789",
    minLength: 11,
    maxLength: 11,
    description: "Phone number",
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(11, 11)
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;
}
