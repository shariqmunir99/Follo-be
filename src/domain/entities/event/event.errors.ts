import { GuardViolationError, type UUID } from '@carbonteq/hexapp';
import { HttpException, HttpStatus } from '@nestjs/common';

export class EventNotFound extends HttpException {
  constructor(id: string) {
    super(`Event with id <${id}> doesn't exist`, HttpStatus.NOT_FOUND);
  }
}

export class UnverifiedUser extends GuardViolationError {
  constructor(readonly id: UUID) {
    super('Please verify your account');
  }
}
