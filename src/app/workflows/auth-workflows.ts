import { Injectable } from '@nestjs/common';
import { InvalidCredentials } from 'src/domain/entities/user/user.errors';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from 'src/domain/entities/user/user.repository';
import { User } from 'src/domain/entities/user/user.entity';
import ArgonPwHasher from 'src/app/services/auth-services/pwHasher.service';
import { LoginDto, SignUpDto } from '../dtos/auth.dto';
import { ResetRequestRepository } from 'src/domain/entities/reset-requests/reset-request.repository';
import { VerifyRequestRepository } from 'src/domain/entities/verify-requests/verify-request.repository';
import { ResetRequest } from 'src/domain/entities/reset-requests/reset-request.entity';
import { VerifyRequest } from 'src/domain/entities/verify-requests/verify-request.entity';
import { MailService } from '../services/auth-services/email.service';
import { RoleRepository } from 'src/domain/entities/role/role.repository';
import { Role } from 'src/domain/entities/role/role.entity';

@Injectable()
export class AuthWorkflows {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly pwHasher: ArgonPwHasher,
    private readonly jwtService: JwtService,
    private readonly resetReqRepo: ResetRequestRepository,
    private readonly verifyReqRepo: VerifyRequestRepository,
    private readonly emailService: MailService,
    private readonly roleRepo: RoleRepository,
  ) {}

  async demoSignIn() {
    const role1 = Role.new('Organizer');
    const role2 = Role.new('User');
    const res1 = await this.roleRepo.insert(role1);
    const res2 = await this.roleRepo.insert(role2);

    return {
      organizer: res1,
      user: res2,
    };
  }
  async login(credentials: LoginDto) {
    //Get user from database
    const { email, password } = credentials;
    const user: User = await this.userRepo.fetchByEmail(email);

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

    const role: Role = await this.roleRepo.fetchById(user.roleID);
    console.log(role);
    const roleName = role.roleName;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pwHashed, roleID, ...resultFields } = user;
    const result = { ...resultFields, roleName };
    return {
      message: 'Success',
      jwtToken: accessToken,
      result: result,
    };
  }

  async signUp(credentials: SignUpDto) {
    const { username, email, password, isOrganizer, baseUrl } = credentials;

    // creating the new user
    const hashed_password = await this.pwHasher.hashPassword(password);

    let role: Role;
    if (isOrganizer) {
      role = await this.roleRepo.fetchByRole('Organizer');
    } else role = await this.roleRepo.fetchByRole('User');

    const user = User.new(username, email, hashed_password, role.id);
    const verify_request = VerifyRequest.new(user.id);

    await this.userRepo.insert(user);
    await this.verifyReqRepo.insert(verify_request);

    await this.emailService.sendVerifyEmail({
      user_name: username,
      user_email: email,
      href: baseUrl + '/' + verify_request.id,
    });

    return {
      message: 'success',
    };
  }
  async resetPassword() {}
  async forgotPassword() {}
}
