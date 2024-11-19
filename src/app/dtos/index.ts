import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOne', async: false })
export class AtLeastOnePropertyConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const object = args.object;
    return Object.values(object).some(
      (val) => val !== undefined && val !== null,
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'At least one property must be provided.';
  }
}
