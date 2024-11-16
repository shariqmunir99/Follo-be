import { HttpException, HttpStatus } from '@nestjs/common';

export class InterestedByNotFound extends HttpException {
  constructor(id: string, field?: 'userId' | 'eventId') {
    if (field === 'userId')
      super(`No entries found for user with id <${id}> `, HttpStatus.CONFLICT);
    else if (field === 'eventId')
      super(`No entries found for event with id <${id}> `, HttpStatus.CONFLICT);
    else super(`Invalid Operation `, HttpStatus.CONFLICT);
  }
}
