import { Injectable } from '@nestjs/common';
import { FavoritedByRepository } from 'src/domain/entities/favorited-by/favorited-by.repository';
import { FollowRepository } from 'src/domain/entities/follow/follow.repository';
import { InterestedByRepository } from 'src/domain/entities/interested-by/interested-by.repository';
import { UserRepository } from 'src/domain/entities/user/user.repository';
import { EditProfileDto, FollowDto } from '../dtos/user.dto';
import { UserDomainService } from 'src/domain/services/user.domain-service';
import { User } from 'src/domain/entities/user/user.entity';
import { Follow } from 'src/domain/entities/follow/follow.entity';

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

  async addFollow({ organizer_id }: FollowDto, user: User) {
    this.userDomServ.isVerified(user); //checking if user that is trying to follow is verified
    const newFollow = Follow.new(user.id, organizer_id); //creating new follow entity
    await this.followRepo.insert(newFollow); //insertion in db
    return { message: 'Resource added Successfully' };
  }

  async removeFollow({ organizer_id }: FollowDto, user: User) {
    await this.followRepo.delete(organizer_id, user.id);
    return { message: 'Resource deleted successfully' };
  }

  async fetchInterestedEvents(user: User) {
    const result = await this.interestedByRepo.fetchByUserId(user.id);
    return { result: result };
  }

  async fetchFavoritedEvents(user: User) {}
}
