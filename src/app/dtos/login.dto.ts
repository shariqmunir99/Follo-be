import {  IsString, IsEmail, MinLength,Matches } from "class-validator";

export class LoginDto
{
    @IsEmail()
    email: string;
    
    @IsString()
    password: string;
}