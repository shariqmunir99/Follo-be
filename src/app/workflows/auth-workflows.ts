import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/entities/user/user-repository';
import { User } from 'src/domain/entities/user/user.entity';
import ArgonPwHasher from 'src/infra/pwHasher';

@Injectable()
export class AuthWorkflows {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly pwHasher: ArgonPwHasher,
  ) {}

  async demo() {
    const email = 's@sd.com';
    const username = 'sharyboi';
    const password = await this.pwHasher.hashPassword('asdasdasd');
    return this.userRepo.insert(User.new(username, email, password));
  }

  async login() {}
  async signUp() {}
  async resetPassword() {}
  async forgotPassword() {}
}
