import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class ForgetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(11, 11)
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;
}
