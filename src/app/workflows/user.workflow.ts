import { Injectable } from '@nestjs/common';
import { FavoritedByRepository } from 'src/domain/entities/favorited-by/favorited-by.repository';
import { FollowRepository } from 'src/domain/entities/follow/follow.repository';
import { InterestedByRepository } from 'src/domain/entities/interested-by/interested-by.repository';
import { UserRepository } from 'src/domain/entities/user/user.repository';
import { EditProfileDto, FollowDto } from '../dtos/user.dto';
import { UserDomainService } from 'src/domain/services/user.domain-service';
import { User } from 'src/domain/entities/user/user.entity';

@Injectable()
export class UserWorkflows {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly followRepo: FollowRepository,
    private readonly interestedByRepo: InterestedByRepository,
    private readonly favoritedByRepo: FavoritedByRepository,
    private readonly userDomServ: UserDomainService,
  ) {}

  async editProfile(
    { new_username, new_password }: EditProfileDto,
    user: User,
  ) {
    const updatedUser = await this.userDomServ.editProfile(
      user,
      new_username,
      new_password,
    );

    console.log('Here');
    await this.userRepo.update(updatedUser);

    return {
      message: 'Resource Updated Successfully',
    };
  }

  async getProfile(user: User) {}

  async addFollow({ organizer_id }: FollowDto, user: User) {}

  async removeFollow({ organizer_id }: FollowDto, user: User) {}

  async fetchInterestedEvents(user: User) {}

  async fetchFavoritedEvents(user: User) {}
}
