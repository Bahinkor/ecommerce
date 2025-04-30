import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdatePasswordDto {
  @ApiProperty({
    type: "string",
    example: "example-password",
    minLength: 6,
    maxLength: 16,
    description: "User's current password, length should be between 6 and 16",
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 16)
  currentPassword: string;

  @ApiProperty({
    type: "string",
    example: "new-password",
    minLength: 6,
    maxLength: 16,
    description: "User's new password, length should be between 6 and 16",
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 16)
  newPassword: string;
}
