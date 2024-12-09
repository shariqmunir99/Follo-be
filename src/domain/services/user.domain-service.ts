import { Injectable } from '@nestjs/common';
import { User } from '../entities/user/user.entity';
import { UnverifiedUser } from '../entities/user/user.errors';
import ArgonPwHasher from 'src/app/services/auth-services/pwHasher.service';

@Injectable()
export class UserDomainService {
  constructor(private readonly pwHasher: ArgonPwHasher) {}
  async editProfile(
    user: User,
    newUsername: string | null,
    newPassword: string | null,
    newLocation: string | null,
  ) {
    const isVerified = user.isVerified;

    if (!isVerified) throw new UnverifiedUser();

    if (newUsername) {
      user.usernameUpdate(newUsername);
    }

    if (newPassword) {
      const newPwHash = await this.pwHasher.hashPassword(newPassword);
      user.passwordUpdate(newPwHash);
    }

    if (newLocation) {
      user.locationUpdate(newLocation);
    }

    return user;
  }

  isVerified(user: User) {
    if (user.isVerified) {
      return;
    }
    throw new UnverifiedUser();
  }
}
