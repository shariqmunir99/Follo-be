import { Injectable } from '@nestjs/common';
import { FavoritedByRepository } from 'src/domain/entities/favorited-by/favorited-by.repository';
import { FollowRepository } from 'src/domain/entities/follow/follow.repository';
import { InterestedByRepository } from 'src/domain/entities/interested-by/interested-by.repository';
import { UserRepository } from 'src/domain/entities/user/user.repository';
import {
  EditProfileDto,
  FollowDto,
  OrganizerProfileDto,
  PaginationParamDto,
  VerifyDto,
} from '../dtos/user.dto';
import { UserDomainService } from 'src/domain/services/user.domain-service';
import { User } from 'src/domain/entities/user/user.entity';

import { Follow } from 'src/domain/entities/follow/follow.entity';

import { RoleRepository } from 'src/domain/entities/role/role.repository';
import { EventRepository } from 'src/domain/entities/event/event.repository';

import { VerifyRequestRepository } from 'src/domain/entities/verify-requests/verify-request.repository';
import { ResetRequestRepository } from 'src/domain/entities/reset-requests/reset-request.repository';
import { MailService } from '../services/auth-services/email.service';
import { VerifyRequest } from 'src/domain/entities/verify-requests/verify-request.entity';
import { statSync } from 'fs';

@Injectable()
export class UserWorkflows {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly eventRepo: EventRepository,
    private readonly followRepo: FollowRepository,
    private readonly interestedByRepo: InterestedByRepository,
    private readonly favoritedByRepo: FavoritedByRepository,
    private readonly roleRepo: RoleRepository,
    private readonly verifyReqRepo: VerifyRequestRepository,
    private readonly resetReqRepo: ResetRequestRepository,
    private readonly userDomServ: UserDomainService,
    private readonly emailService: MailService,
  ) {}

  async editProfile(
    {
      new_username,
      new_password,
      new_location,
      new_profile_pic,
    }: EditProfileDto,
    user: User,
    file: Express.Multer.File,
  ) {
    console.log('File: ', file);
    const updatedUser = await this.userDomServ.editProfile(
      user,
      new_username,
      new_password,
      new_location,
      new_profile_pic,
      file,
    );

    await this.userRepo.update(updatedUser);

    return {
      message: 'Resource Updated Successfully',
    };
  }

  async getEvents({ page, limit }: PaginationParamDto, user: User) {
    const events = await this.eventRepo.fetchPaginatedByOrgId(
      [user.id],
      (page - 1) * limit,
      limit,
    );
    const { profilePicUrl, username } = await this.userRepo.fetchById(
      events[0].userId,
    );
    const results = await Promise.all(
      events.map(async (event) => {
        const stats = await this.getEventStats(event.id);
        return {
          ...{
            ...event,
            organizer: username,
            organizer_id: event.userId,
            profilePic: profilePicUrl,
            ...stats,
          },
        };
      }),
    );

    return { data: results, currentPage: page };
  }

  async fetchOrganizerProfile({
    page,
    limit,
    organizer_id,
  }: OrganizerProfileDto) {
    const organizer = await this.userRepo.fetchById(organizer_id);
    return await this.getEvents({ page, limit }, organizer);
  }

  async getHomepage({ page, limit }: PaginationParamDto, user: User) {
    const following = await this.followRepo.fetchFollowing(user.id);
    const followedOrganizerIds = following.map((f) => f.followingId);

    const interested = await this.interestedByRepo.fetchByUserId(user.id);
    const interestedEventIds = interested.map((i) => i.eventId);

    const favorited = await this.favoritedByRepo.fetchByUserId(user.id);
    const favoritedEventIds = favorited.map((f) => f.eventId);

    console.log(favoritedEventIds);

    const followedEvents = await this.eventRepo.fetchPaginatedByOrgId(
      followedOrganizerIds,
      0,
      Number.MAX_SAFE_INTEGER,
    );

    const localEvents = await this.eventRepo.fetchPaginatedEventsExceptLocation(
      user.location,
      0,
      Number.MAX_SAFE_INTEGER,
      followedOrganizerIds,
      false,
    );

    const remainingEvents =
      await this.eventRepo.fetchPaginatedEventsExceptLocation(
        user.location,
        0,
        Number.MAX_SAFE_INTEGER,
        followedOrganizerIds,
        true,
      );

    const allEvents = [...followedEvents, ...localEvents, ...remainingEvents];

    const sortedEvents = await Promise.all(
      allEvents.map(async (event) => {
        const stats = await this.getEventStats(event.id);
        const { profilePicUrl, username } = await this.userRepo.fetchById(
          event.userId,
        );
        let isFollowing = false;
        let isInterested = false;
        let isFavorited = false;
        if (followedOrganizerIds.includes(event.userId)) isFollowing = true;
        if (interestedEventIds.includes(event.id)) isInterested = true;
        if (favoritedEventIds.includes(event.id)) isFavorited = true;
        return {
          ...{
            ...event,
            organizer_id: event.userId,
            organizer: username,
            profilePic: profilePicUrl,
            ...stats,
            isFollowing,
            isInterested,
            isFavorited,
          },
        };
      }),
    );

    const offset = (page - 1) * limit;

    const paginatedEvents = sortedEvents.slice(offset, offset + limit);
    console.log('Result Homepage');
    return { currentPage: page, data: paginatedEvents };
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

    console.log({ ...user.serialize(), ...stats });
    return {
      result: { ...user.serialize(), ...stats },
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

  async fetchInterestedEvents({ page, limit }, user: User) {
    const events = await this.interestedByRepo.fetchPaginatedByUserId(
      user.id,
      (page - 1) * limit,
      limit,
    );

    const result = await Promise.all(
      events.map(async (event) => {
        const stats = await this.getEventStats(event.id);
        const { username, profilePicUrl } = await this.userRepo.fetchById(
          event.userId,
        );
        return {
          ...{
            ...event,
            organizer: username,
            profilePic: profilePicUrl,
            organizer_id: event.userId,
            ...stats,
          },
        };
      }),
    );

    console.log(result);
    return { currentPage: page, data: result };
  }

  async fetchFavoritedEvents({ page, limit }, user: User) {
    const events = await this.favoritedByRepo.fetchPaginatedByUserId(
      user.id,
      (page - 1) * limit,
      limit,
    );

    const result = await Promise.all(
      events.map(async (event) => {
        const stats = await this.getEventStats(event.id);
        const { username, profilePicUrl } = await this.userRepo.fetchById(
          event.userId,
        );
        return {
          ...{
            ...event,
            organizer: username,
            profilePic: profilePicUrl,
            organizer_id: event.userId,
            ...stats,
          },
        };
      }),
    );

    console.log(result);
    return { currentPage: page, data: result };
  }

  async deleteUser(userId: string) {
    //Delete Following.
    await this.followRepo.deleteByFollowerId(userId);

    //Delete Interested Events.
    await this.interestedByRepo.deleteByUserId(userId);

    //Delete Favorited Events.
    await this.favoritedByRepo.deleteByUserId(userId);
  }

  async deleteOrganizer(organizerId: string) {
    //Delete Followers.
    await this.followRepo.deleteByFollowingId(organizerId);

    //Delete Events.
    const events = await this.eventRepo.fetchByOrganizerId(organizerId);
    for (let index in events) {
      const eventId = events[index].id;
      await this.favoritedByRepo.deleteByEventId(eventId);
      await this.interestedByRepo.deleteByEventId(eventId);
      await this.eventRepo.delete(eventId);
    }
  }

  async delete(user: User) {
    //Delete Verify Requests.
    await this.verifyReqRepo.deleteByUserId(user.id);

    //Delete Reset Requests.
    await this.resetReqRepo.deleteByUserId(user.id);

    const role = await this.roleRepo.fetchById(user.roleID);

    if (role.roleName === 'Organizer') {
      await this.deleteOrganizer(user.id);
    } else {
      await this.deleteUser(user.id);
    }

    await this.userRepo.delete(user.id);

    return {
      message: 'Resource deleted successfully.',
    };
  }

  async sortEvents(topFiveEvents) {
    let sortedFiveEvents = topFiveEvents.sort(
      (a, b) => a.interactions - b.interactions,
    );
    sortedFiveEvents.reverse();

    if (sortedFiveEvents.length > 5) {
      sortedFiveEvents = sortedFiveEvents.slice(0, 5);
    }
    return sortedFiveEvents;
  }

  async getAllRecentlyInteractedEvents(events, org) {
    let recentlyInteractedEvents = [];
    let totalInteractions = 0;
    for (let index in events) {
      const eventId = events[index].id;
      const recentInteractions =
        await this.interestedByRepo.getRecentInteractionsCount(eventId);
      totalInteractions += recentInteractions;

      const entry = {
        organizer: org.username,
        ...events[index],
        interactions: recentInteractions,
      };
      recentlyInteractedEvents.push(entry);
    }
    return { recentlyInteractedEvents, totalInteractions };
  }

  async organizerDashboard(org: User) {
    const followersCount = await this.followRepo.getRecentFollowersCount(
      org.id,
    );

    const events = await this.eventRepo.fetchByOrganizerId(org.id);
    let result = await this.getAllRecentlyInteractedEvents(events, org);
    let recentlyInteractedEvents = result.recentlyInteractedEvents;
    let totalInteractions = result.totalInteractions;

    recentlyInteractedEvents = await this.sortEvents(recentlyInteractedEvents);
    return {
      Followers: followersCount,
      Interactions: totalInteractions,
      Events: recentlyInteractedEvents,
    };
  }

  async verifyAccount({ baseUrl }: VerifyDto, user: User) {
    const verifyReq = VerifyRequest.new(user.id);
    await this.verifyReqRepo.insert(verifyReq);
    await this.emailService.sendVerifyEmail({
      user_name: user.username,
      user_email: user.email,
      href: baseUrl + '/' + verifyReq.id,
    });

    console.log(baseUrl + '/' + verifyReq.id);
    return {
      message: 'success',
    };
  }
}
