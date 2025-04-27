import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

import { UserRoleEnum } from "../enums/user-role.enum";

export class UpdateUserDto {
  @ApiProperty({ type: String, example: "John Doe", description: "User's display name" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  @IsOptional()
  displayName: string;

  @ApiProperty({ type: String, example: "user", description: "User's role, user or admin" })
  @IsEnum(UserRoleEnum)
  @IsOptional()
  role: UserRoleEnum;
}
