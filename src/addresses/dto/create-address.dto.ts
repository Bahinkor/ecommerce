import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateAddressDto {
  @ApiProperty({
    type: "string",
    example: "Tehran",
    description: "Address's province",
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({
    type: "string",
    example: "Tehran",
    description: "Address's city",
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    type: "string",
    example: "details address",
    description: "Address's district",
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    type: "string",
    example: "1111111111",
    description: "Address's postal code",
    minLength: 10,
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(10, 10)
  postalCode: string;

  @ApiProperty({
    type: "string",
    example: "09111111111",
    description: "Address's receiver phone number",
    minLength: 11,
    maxLength: 11,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(11, 11)
  @Matches(/^09[0-9]{9}$/)
  receiverPhoneNumber: string;

  @ApiProperty({
    type: "string",
    example: "example desc",
    description: "Address's description",
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;
}
