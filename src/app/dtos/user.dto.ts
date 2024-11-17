import {
  IsOptional,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from 'src/domain/entities/user/user.entity';

// Custom validator to check if at least one property is present
@ValidatorConstraint({ name: 'AtLeastOne', async: false })
class AtLeastOnePropertyConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object;
    return Object.values(object).some(
      (val) => val !== undefined && val !== null,
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'At least one of new_password or new_username must be provided.';
  }
}

export class EditProfileDto {
  @IsString()
  @IsOptional()
  new_username: string;

  @IsString()
  @IsOptional()
  new_password: string;

  @Validate(AtLeastOnePropertyConstraint)
  atLeastOneProperty: EditProfileDto;
}
