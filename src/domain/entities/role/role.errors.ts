import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleNotFound extends HttpException {
  constructor(id: string) {
    super(`Role with id <${id}> doesn't exist`, HttpStatus.NOT_FOUND);
  }
}

export class RoleAlreadyExists extends HttpException {
  constructor(field: string) {
    super(`Role with this ${field} already exists`, HttpStatus.CONFLICT);
  }
}
