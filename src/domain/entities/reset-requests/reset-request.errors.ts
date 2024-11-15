import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidResetRequest extends HttpException {
  constructor(reqId: string) {
    super(`Invalid Reset request. <${reqId}>`, HttpStatus.NOT_FOUND);
  }
}
