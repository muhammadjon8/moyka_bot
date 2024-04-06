import {IsNotEmpty,IsEmail, IsString } from "class-validator";
export class LoginUserDto{


      @IsEmail()
      email: string;

      @IsString()
      @IsNotEmpty()
      password: string;

       
}