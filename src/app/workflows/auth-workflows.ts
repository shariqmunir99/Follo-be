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
import { LoginDto } from '../dtos/login.dto';

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

  async login(credentials: LoginDto) {
    //Get user from database
    const { email, password } = credentials;
    const user: DatabaseUser = await this.userRepo.fetchByEmail(email);

    if (!user) {
      throw new UserNotFound(email);
    }

    //this compares hashed and entered password pasword
    const isMatch = await this.pwHasher.verifyPassword(user.pwHashed, password);
    if (!isMatch) {
      throw new InvalidCredentials();
    }

    //Generate JWT Tokens
    const accessToken = this.jwtService.sign({
      email: user.email,
      id: user.id,
    });

    return {
      message: 'LogIn Successfully',
      jwtToken: accessToken,
    };
  }

  async signUp(credentials) {
    const { username, email, password } = credentials;

    // creating the new user
    const hashed_password = await this.pwHasher.hashPassword(password);
    const user = User.new(username, email, hashed_password);

    try {
      await this.userRepo.insert(user);
    } catch (e) {
      throw e;
    }

    return {
      message: 'success',
    };
  }
  async resetPassword() {}
  async forgotPassword() {}
}
