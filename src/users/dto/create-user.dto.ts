import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'bekzodToxtamuratov',
    description: 'Foydalanuvchi fullname',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    example: 'example phone',
    description: 'Foydalanuvchi phone',
  })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    example: 'example email',
    description: 'Foydalanuvchi email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'example password',
    description: 'Foydalanuvchi password',
  })
  @ApiProperty({
    example: 'example password',
    description: 'Foydalanuvchi password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'example confirm_password',
    description: 'Foydalanuvchi confirm_password',
  })
  @IsString()
  @IsNotEmpty()
  confirm_password: string;

  // @IsDateString()

  @ApiProperty({
    example: 'example tg_link',
    description: 'Foydalanuvchi tg_link',
  })
  @IsString()
  tg_link: string;

  @ApiProperty({
    example: 'example photo',
    description: 'Foydalanuvchi photo',
  })
  @IsString()
  photo: string;

  // @IsDateString()
  // data:Date;
}
