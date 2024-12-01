import {
  IsDateString,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { AtLeastOnePropertyConstraint } from '.';

export class CreateEventDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  type: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsDateString()
  @MinLength(1)
  date: string;

  @IsString()
  @MinLength(1)
  city: string;

  @IsString()
  @MinLength(1)
  country: string;

  @IsString()
  @MinLength(1)
  venue: string;
}

export class EditEventDto {
  @IsString()
  event_id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsOptional()
  date: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  venue: string;

  @Validate(AtLeastOnePropertyConstraint)
  atLeastOneProperty: EditEventDto;
}

export class GetEventDto {
  @IsString()
  event_id: string;
}

export class DeleteEventDto {
  @IsString()
  event_id: string;
}

export class InteractionDto {
  @IsString()
  event_id: string;
}
