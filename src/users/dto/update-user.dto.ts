import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

import { UserRoleEnum } from "../enums/user-role.enum";

export class UpdateUserDto {
  @ApiProperty({
    type: "string",
    example: "John Doe",
    minLength: 1,
    maxLength: 35,
    description: "User's display name",
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  @IsOptional()
  displayName: string;

  @ApiProperty({
    type: "string",
    example: "user",
    enum: UserRoleEnum,
    description: "User's role, user or admin",
    required: false,
  })
  @IsEnum(UserRoleEnum)
  @IsOptional()
  role: UserRoleEnum;
}
