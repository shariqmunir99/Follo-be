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
  location: string;

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

export class VerifyDto {
  @IsString()
  verify_token: string;

  // @IsString()
  // password: string;
}

export class ForgotPasswordDto {
  @IsString()
  email: string;

  @IsUrl()
  baseUrl: string;
  // @IsString()
  // password: string;
}

export class ResetPasswordDto {
  @IsString()
  reset_token: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain atleast one number',
  })
  new_password: string;
}
