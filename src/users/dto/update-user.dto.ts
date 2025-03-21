import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

import UserRoleEnum from "../enums/user-role.enum";

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  @IsOptional()
  display_name: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  role: UserRoleEnum;
}
