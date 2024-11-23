import { Injectable } from '@nestjs/common';
import { FavoritedByRepository } from 'src/domain/entities/favorited-by/favorited-by.repository';
import { FollowRepository } from 'src/domain/entities/follow/follow.repository';
import { InterestedByRepository } from 'src/domain/entities/interested-by/interested-by.repository';
import { UserRepository } from 'src/domain/entities/user/user.repository';
import { EditProfileDto, FollowDto } from '../dtos/user.dto';
import { UserDomainService } from 'src/domain/services/user.domain-service';
import { User } from 'src/domain/entities/user/user.entity';

import { Follow } from 'src/domain/entities/follow/follow.entity';

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
    private readonly roleRepo: RoleRepository,
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
    const role = await this.roleRepo.fetchById(roleId);
    let stats = {};

    if (role.roleName === 'User') {
      stats = await this.getUserStats(user.id);
    } else if (role.roleName === 'Organizer') {
      stats = await this.getOrganizerStats(user.id);
    }

    return {
      result: { ...user, ...stats },
    };
  }

  // calculated the stats of the organizer
  async getOrganizerStats(orgId: string) {
    // get all the events of the organizer
    const events = await this.eventRepo.fetchByOrganizerId(orgId);
    let interestsCount = 0;

    // get the favorite and interest count of each event
    for (let index in events) {
      const eventId = events[index].id; // extracting the event id of an event
      const eventStats = await this.getEventStats(eventId); // getting the stats for that specific event

      interestsCount += eventStats.Interests;
    }

    // get the followers of the organizer
    const followers = await this.followRepo.fetchFollowers(orgId);

    return {
      posts: events.length,
      interactions: interestsCount,
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
