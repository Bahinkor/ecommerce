import { IsNotEmpty, IsString, Length, MaxLength, MinLength } from "class-validator";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import UserRoleEnum from "../enums/userRole.enum";

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 11 })
  @IsString()
  @Length(11, 11)
  phone_number: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(35)
  display_name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: "enum", enum: UserRoleEnum, default: UserRoleEnum.NormalUser })
  role: UserRoleEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
