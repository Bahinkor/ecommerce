import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(11, 11)
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otpPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 16)
  newPassword: string;
}
