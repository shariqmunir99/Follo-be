import { HttpException, HttpStatus } from '@nestjs/common';

export class FollowNotFound extends HttpException {
  constructor(id: string, field?: 'organizerId' | 'userId') {
    if (field === 'userId')
      super(
        `No following found for user with id <${id}> `,
        HttpStatus.CONFLICT,
      );
    else if (field === 'organizerId')
      super(
        `No followers found for organizer with id <${id}> `,
        HttpStatus.CONFLICT,
      );
    else super(`Invalid Operation `, HttpStatus.CONFLICT);
  }
}

export class FollowAlreadyExists extends HttpException {
  constructor(
    readonly followerId: string,
    readonly followingId: string,
  ) {
    super(
      `User ${followerId} is already following Organizer ${followingId} `,
      HttpStatus.CONFLICT,
    );
  }
}
