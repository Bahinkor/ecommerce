import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

import UserRoleEnum from "../enums/userRole.enum";

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  display_name: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  role: UserRoleEnum;
}
