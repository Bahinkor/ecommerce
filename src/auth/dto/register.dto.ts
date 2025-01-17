import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length, Matches, MaxLength } from "class-validator";

export class Register {
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
  @IsNotEmpty()
  @Length(6, 16)
  password: string;
}
