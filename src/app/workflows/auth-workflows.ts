import { Injectable } from '@nestjs/common';
import {
  InvalidCredentials,
  UserNotFound,
} from 'src/domain/entities/user/user-errors';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from 'src/domain/entities/user/user-repository';
import { User } from 'src/domain/entities/user/user.entity';
import ArgonPwHasher from 'src/app/services/auth-services/pwHasher.service';
import { DatabaseUser } from 'src/infra/types';

@Injectable()
export class AuthWorkflows {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly pwHasher: ArgonPwHasher,
    private readonly jwtService: JwtService,
  ) {}

  async demoSignIn() {
    const email = 's@sd.com';
    const username = 'sharyboi';
    const password = await this.pwHasher.hashPassword('asdasdasd');
    return this.userRepo.insert(User.new(username, email, password));
  }

  async demoLogin() {
    //Get user from database

    const user: DatabaseUser = await this.userRepo.fetchByEmail('s@sd.com');
    if (!user) {
      throw new UserNotFound('s@sd.com');
    }

    //Compare passwords
    console.log(user.pwHashed);
    const isMatch = await this.pwHasher.verifyPassword(
      user.pwHashed,
      'asdasdasd',
    );
    if (!isMatch) {
      throw new InvalidCredentials();
    }

    //Generate JWT Tokens
    const accessToken = this.jwtService.sign({
      email: user.email,
      id: user.id,
    });

    return {
      message: 'Success',
      jwtToken: accessToken,
    };
  }
  async signUp() {}
  async resetPassword() {}
  async forgotPassword() {}
}
