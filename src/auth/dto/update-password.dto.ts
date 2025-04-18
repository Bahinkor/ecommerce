import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 16)
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 16)
  newPassword: string;
}
