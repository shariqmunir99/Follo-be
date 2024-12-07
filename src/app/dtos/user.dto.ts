import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { AtLeastOnePropertyConstraint } from '.';
import { Type } from 'class-transformer';

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

export class MyEventDto {
  @Type(() => Number) // Ensures transformation from string to number
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1; // Default value is 1

  @Type(() => Number) // Ensures transformation from string to number
  @IsInt({ message: 'Limit must be an integer' })
  @IsPositive({ message: 'Limit must be a positive number' })
  @Max(5, { message: 'Limit cannot exceed 5' })
  limit: number = 5; // Default value is 5
}

export class VerifyDto {
  @IsUrl()
  baseUrl: string;
}
