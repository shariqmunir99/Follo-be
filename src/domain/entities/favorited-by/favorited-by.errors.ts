import { HttpException, HttpStatus } from '@nestjs/common';

export class FavoritedByNotFound extends HttpException {
  constructor(id: string, field?: 'userId' | 'eventId') {
    if (field === 'userId')
      super(`No entries found for user with id <${id}> `, HttpStatus.CONFLICT);
    else if (field === 'eventId')
      super(`No entries found for event with id <${id}> `, HttpStatus.CONFLICT);
    else super(`Invalid Operation `, HttpStatus.CONFLICT);
  }
}

export class FavoritedByAlreadyExists extends HttpException {
  constructor(
    readonly userId: string,
    readonly eventID: string,
  ) {
    super(
      `User ${userId} is already interested in event ${eventID} `,
      HttpStatus.CONFLICT,
    );
  }
}
