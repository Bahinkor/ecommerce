import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import UserRoleEnum from "../enums/userRole.enum";

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone_number: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(35)
  display_name: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: UserRoleEnum, default: UserRoleEnum.NormalUser })
  role: UserRoleEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
