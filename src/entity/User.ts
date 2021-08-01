import { Exclude } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsDateString, IsNumber, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

export enum AppRoles {
  USER = "USER",
  ADVANCED = "ADVANCED",
  USERADMIN = "USERADMIN",
  ADMIN = "ADMIN",
}
@Entity("users")
export default class User {

  @IsNumber()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @IsString()
  @Column({ unique: true })
  name: string;

  @Exclude()
  @Column()
  password: string;

  @IsArray()
  @Column({
    type: "text",
    enum: AppRoles,
    array: true,
  })
  roles: AppRoles[];

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @IsDateString()
  @UpdateDateColumn()
  updatedAt: Date;
  
}
