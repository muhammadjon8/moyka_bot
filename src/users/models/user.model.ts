import { ApiProperty } from "@nestjs/swagger";
import {Column, DataType, Model, Table } from "sequelize-typescript";

interface IUserCreationAttr{
      full_name: string;
      phone:string;
      email:string;
      hashed_password:string;
      tg_link:string;
      photo:string;
}
@Table({ tableName: 'users' })
export class User extends Model<User, IUserCreationAttr> {
  @ApiProperty({
    example: '1',
    description: 'Foydalanuvchi Id unikal raqami',
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'BekzodToxtamuratov',
    description: 'Foydalanuvchi fullName',
  })
  @Column({
    type: DataType.STRING,
  })
  full_name: string;

  @ApiProperty({
    example: '+998930894182',
    description: 'Foydalanuvchi phone',
  })
  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @ApiProperty({
    example: 'bekzodtoxtamuratov01@gmail.com',
    description: 'Foydalanuvchi email',
  })
  @Column({
    type: DataType.STRING,
  })
  email: string;

  @ApiProperty({
    example: 'hashed_passworddadas131232654378refdffiud',
    description: 'Foydalanuvchi hashed_password',
  })
  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @ApiProperty({
    example: 'FullStackDeveloper1',
    description: 'Foydalanuvchi tg_link',
  })
  @Column({
    type: DataType.STRING,
  })
  tg_link: string;

  @ApiProperty({
    example: '5.jpg',
    description: 'Foydalanuvchi photo',
  })
  @Column({
    type: DataType.STRING,
  })
  photo: string;

  @ApiProperty({
    example: 'dadvrdgdfjfjfjd',
    description: 'Foydalanuvchi hashed_refresh_token',
  })
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @ApiProperty({
    example: 'is_owner false',
    description: 'Foydalanuvchi owner is',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_owner: boolean;

  @ApiProperty({
    example: 'is_owner example',
    description: 'Foydalanuvchi is_acrite is',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;

  @ApiProperty({
    example: 'activation_link example',
    description: 'Foydalanuvchi  activation_link',
  })
  @Column({
    type: DataType.STRING,
  })
  activation_link: string;
}
