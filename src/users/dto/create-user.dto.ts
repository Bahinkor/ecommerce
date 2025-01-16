import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

import UserRoleEnum from "../enums/userRole.enum";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  display_name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(11, 11)
  @Matches(/^09[0-9]{9}$/)
  phone_number: string;

  @IsString()
  @IsOptional()
  @Length(6, 45)
  password: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  role: UserRoleEnum;
}
