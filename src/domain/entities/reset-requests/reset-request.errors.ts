import { HttpException, HttpStatus } from '@nestjs/common';

export class ResetRequestNotFound extends HttpException {
  constructor(reqId: string) {
    super(`Reset Request with id <${reqId}> not found`, HttpStatus.NOT_FOUND);
  }
}
