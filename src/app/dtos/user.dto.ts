import { IsOptional, IsString, IsUrl, Validate } from 'class-validator';
import { AtLeastOnePropertyConstraint } from '.';

// Custom validator to check if at least one property is present

export class EditProfileDto {
  @IsString()
  @IsOptional()
  new_username: string;

  @IsString()
  @IsOptional()
  new_password: string;

  @IsString()
  @IsOptional()
  new_location: string;

  @IsString()
  @IsOptional()
  new_profile_pic: boolean;

  @Validate(AtLeastOnePropertyConstraint)
  atLeastOneProperty: EditProfileDto;
}

export class FollowDto {
  @IsString()
  organizer_id: string;
}

export class VerifyDto {
  @IsUrl()
  baseUrl: string;
}
