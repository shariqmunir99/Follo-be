import {
  IsBoolean,
  IsEmail,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain atleast one number',
  })
  password: string;

  @IsBoolean()
  isOrganizer: boolean;

  @IsUrl()
  baseUrl: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
