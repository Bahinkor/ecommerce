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

import UserRoleEnum from "../enums/user-role.enum";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  display_name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(11, 11)
  @Matches(/^09[0-9]{9}$/)
  phone_number: string;

  @IsString()
  @IsOptional()
  @Length(6, 16)
  password: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  role: UserRoleEnum;
}
