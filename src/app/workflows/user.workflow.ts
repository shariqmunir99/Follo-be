import { Injectable } from '@nestjs/common';
import { FavoritedByRepository } from 'src/domain/entities/favorited-by/favorited-by.repository';
import { FollowRepository } from 'src/domain/entities/follow/follow.repository';
import { InterestedByRepository } from 'src/domain/entities/interested-by/interested-by.repository';
import { UserRepository } from 'src/domain/entities/user/user.repository';
import { EditProfileDto, FollowDto } from '../dtos/user.dto';
import { UserDomainService } from 'src/domain/services/user.domain-service';
import { User } from 'src/domain/entities/user/user.entity';
import { RoleRepository } from 'src/domain/entities/role/role.repository';
import { EventRepository } from 'src/domain/entities/event/event.repository';

@Injectable()
export class UserWorkflows {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly eventRepo: EventRepository,
    private readonly followRepo: FollowRepository,
    private readonly interestedByRepo: InterestedByRepository,
    private readonly favoritedByRepo: FavoritedByRepository,
    private readonly roleyRepo: RoleRepository,
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

  async getProfile(user: User) {
    const roleId = user.roleID;

    // getting the role from the role table
    const role = await this.roleyRepo.fetchById(roleId);

    if (role.roleName === 'User') {
      const userStats = await this.getUserStats(user.id);
      return userStats;
    } else if (role.roleName === 'Organizer') {
      const organizerStats = await this.getOrganizerStats(user.id);
      return organizerStats;
    }
  }

  // calculated the stats of the organizer
  async getOrganizerStats(orgId: string) {
    // get all the events of the organizer
    const events = await this.eventRepo.fetchByOrganizerId(orgId);
    let interestsCount = 0;
    let favoritesCount = 0;

    // get the favorite and interest count of each event
    for (let index in events) {
      const eventId = events[index].id; // extracting the event id of an event
      const eventStats = await this.getEventStats(eventId); // getting the stats for that specific event

      favoritesCount += eventStats.Favorites;
      interestsCount += eventStats.Interests;
    }

    // get the followers of the organizer
    const followers = await this.followRepo.fetchFollowers(orgId);

    return {
      favorites: favoritesCount,
      interests: interestsCount,
      followers: followers.length,
    };
  }

  // calculates the favorites and interests of an event based on the event id
  async getEventStats(eventId: string) {
    const favoritedBy = await this.favoritedByRepo.fetchByEventId(eventId);
    const interestedBy = await this.interestedByRepo.fetchByEventId(eventId);

    return {
      Favorites: favoritedBy.length,
      Interests: interestedBy.length,
    };
  }

  // calculate the stats of a user
  async getUserStats(userId: string) {
    const favorites = await this.favoritedByRepo.fetchByUserId(userId);
    const favoriteCount = favorites.length;

    const interests = await this.interestedByRepo.fetchByUserId(userId);
    const interestsCount = interests.length;

    const follow = await this.followRepo.fetchFollowing(userId);
    const followingCount = follow.length;

    return {
      favorites: favoriteCount,
      interests: interestsCount,
      following: followingCount,
    };
  }

  async addFollow({ organizer_id }: FollowDto, user: User) {}

  async removeFollow({ organizer_id }: FollowDto, user: User) {}

  async fetchInterestedEvents(user: User) {}

  async fetchFavoritedEvents(user: User) {
    const favourites = await this.favoritedByRepo.fetchByUserId(user.id);

    let favouriteEvents = [];
    for (let index in favourites) {
      const eventId = favourites[index].eventId;
      const event = await this.eventRepo.fetchById(eventId);
      favouriteEvents.push(event);
    }

    return {
      result: favouriteEvents,
    };
  }
}
