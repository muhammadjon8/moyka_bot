import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class FindeUserDto {
  @ApiProperty({
    example: 'bekzodToxtamuratov',
    description: 'Foydalanuvchi fullname',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  full_name?: string;

  @ApiProperty({
    example: 'example phone',
    description: 'Foydalanuvchi phone',
  })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiProperty({
    example: 'example email',
    description: 'Foydalanuvchi email',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'example email',
    description: 'Foydalanuvchi email',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  tg_link?: string;

 
}
