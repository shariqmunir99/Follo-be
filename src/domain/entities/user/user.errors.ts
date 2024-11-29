import { GuardViolationError, type UUID } from '@carbonteq/hexapp';
import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFound extends HttpException {
  constructor(id: string) {
    super(`User with id <${id}> doesn't exist`, HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExists extends HttpException {
  constructor(
    readonly data: string,
    field: 'email' | 'username',
  ) {
    super(`User with this ${field} already exists`, HttpStatus.CONFLICT);
  }
}

export class InvalidCredentials extends HttpException {
  constructor() {
    super('Invalid email/password', HttpStatus.UNAUTHORIZED);
  }
}

export class UnverifiedUser extends HttpException {
  constructor() {
    super('Please verify your account', HttpStatus.UNAUTHORIZED);
  }
}
