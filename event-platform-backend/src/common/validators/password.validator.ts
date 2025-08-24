import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

// At least 8 chars, one uppercase, one lowercase, one number, one special char
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsStrongPassword',
      target: object.constructor,
      propertyName,
      options: {
        message:
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
        ...validationOptions,
      },
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return typeof value === 'string' && STRONG_PASSWORD.test(value);
        },
      },
    });
  };
}
