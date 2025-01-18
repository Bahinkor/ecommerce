import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(10, 10)
  postal_code: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(11, 11)
  @Matches(/^09[0-9]{9}$/)
  receiver_phone_number: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;
}
