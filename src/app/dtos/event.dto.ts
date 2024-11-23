import { IsDateString, IsOptional, IsString, Validate } from 'class-validator';
import { AtLeastOnePropertyConstraint } from '.';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
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
