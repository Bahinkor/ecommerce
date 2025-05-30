import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from "class-validator";

import { UserRoleEnum } from "../enums/user-role.enum";

export class CreateUserDto {
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

  @ApiProperty({ type: "string", example: "09115555555", description: "User's phone number" })
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
  @IsOptional()
  @Length(6, 16)
  password: string;

  @ApiProperty({
    type: "string",
    enum: UserRoleEnum,
    example: "user",
    description: "User's role, user or admin",
  })
  @IsEnum(UserRoleEnum)
  @IsOptional()
  role: UserRoleEnum;
}
