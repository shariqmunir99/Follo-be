import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidVerifyRequest extends HttpException {
  constructor(reqId: string) {
    super(`Invalid Verify request. <${reqId}>`, HttpStatus.NOT_FOUND);
  }
}
