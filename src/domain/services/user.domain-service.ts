import { Injectable } from '@nestjs/common';
import { defaultProfilePic, User } from '../entities/user/user.entity';
import { UnverifiedUser } from '../entities/user/user.errors';
import ArgonPwHasher from 'src/app/services/auth-services/pwHasher.service';
import { GoogleDriveUploadService } from 'src/app/services/other-services/google-upload.service';

@Injectable()
export class UserDomainService {
  constructor(
    private readonly pwHasher: ArgonPwHasher,
    private readonly googleDriveServ: GoogleDriveUploadService,
  ) {}

  isVerified(user: User) {
    if (user.isVerified) {
      return;
    }
    throw new UnverifiedUser();
  }

  isNewProfilePic(user: User) {
    if (user.profilePicUrl !== defaultProfilePic) return true;
    return false;
  }

  extractPicId(link: string) {
    return link.split('?id=')[-1];
  }

  async editProfile(
    user: User,
    newUsername: string | null,
    newPassword: string | null,
    newLocation: string | null,
    newProfilePic: boolean | null,
    file: Express.Multer.File | null,
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

    if (file && newProfilePic) {
      try {
        if (user.profilePicUrl !== defaultProfilePic) {
          await this.googleDriveServ.deleteImage(
            user.profilePicUrl.split('?id=')[1],
          );
        }
        const picId = await this.googleDriveServ.uploadImage(file);
        user.profilePicUpdate(picId);
      } catch (e) {
        console.log(e);
      }
    }

    return user;
  }
}
