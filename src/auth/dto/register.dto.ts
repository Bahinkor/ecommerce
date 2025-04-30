import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length, Matches, MaxLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    type: "string",
    example: "John Doe",
    minLength: 1,
    maxLength: 35,
    description: "User's display name",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  displayName: string;

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

  @ApiProperty({
    type: "string",
    example: "example-password",
    minLength: 6,
    maxLength: 16,
    description: "User's password, length should be between 6 and 16",
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 16)
  password: string;
}
