import { Injectable } from '@nestjs/common';
import {
  InvalidCredentials,
  UserNotFound,
} from 'src/domain/entities/user/user.errors';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from 'src/domain/entities/user/user.repository';
import { User } from 'src/domain/entities/user/user.entity';
import ArgonPwHasher from 'src/app/services/auth-services/pwHasher.service';
import { DatabaseUser } from 'src/infra/types';
import { LoginDto, SignUpDto } from '../dtos/auth.dto';
import { ResetRequestRepository } from 'src/domain/entities/reset-requests/reset-request.repository';
import { VerifyRequestRepository } from 'src/domain/entities/verify-requests/verify-request.repository';
import { ResetRequest } from 'src/domain/entities/reset-requests/reset-request.entity';
import { VerifyRequest } from 'src/domain/entities/verify-requests/verify-request.entity';

@Injectable()
export class AuthWorkflows {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly pwHasher: ArgonPwHasher,
    private readonly jwtService: JwtService,
    private readonly resetReqRepo: ResetRequestRepository,
    private readonly verifyReqRepo: VerifyRequestRepository,
  ) {}

  async demoSignIn() {
    const email = 's@sd.com';
    const username = 'sharyboi';
    const password = await this.pwHasher.hashPassword('asdasdasd');
    const user: DatabaseUser = await this.userRepo.fetchByEmail(email);
    console.log(user);
    const resReq = ResetRequest.new(user.id);
    const verReq = VerifyRequest.new(user.id);
    const resultResReq = await this.resetReqRepo.insert(resReq);
    const resultVerReq = await this.verifyReqRepo.insert(verReq);
    return {
      resetReq: resultResReq,
      verifyReq: resultVerReq,
    };
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
      message: 'Success',
      jwtToken: accessToken,
    };
  }

  async signUp(credentials: SignUpDto) {
    const { username, email, password } = credentials;

    // creating the new user
    const hashed_password = await this.pwHasher.hashPassword(password);
    const user = User.new(username, email, hashed_password);

    const result = await this.userRepo.insert(user);

    return {
      message: 'success',
      result: result,
    };
  }
  async resetPassword() {}
  async forgotPassword() {}
}
