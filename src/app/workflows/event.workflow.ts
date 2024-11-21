import { Injectable } from '@nestjs/common';
import { Event } from 'src/domain/entities/event/event.entity';
import { EventRepository } from 'src/domain/entities/event/event.repository';
import { FavoritedBy } from 'src/domain/entities/favorited-by/favorited-by.entity';
import { FavoritedByRepository } from 'src/domain/entities/favorited-by/favorited-by.repository';
import { InterestedBy } from 'src/domain/entities/interested-by/interested-by.entity';
import { InterestedByRepository } from 'src/domain/entities/interested-by/interested-by.repository';
import { User } from 'src/domain/entities/user/user.entity';
import { UserRepository } from 'src/domain/entities/user/user.repository';
import {
  CreateEventDto,
  DeleteEventDto,
  EditEventDto,
  GetEventDto,
  InteractionDto,
} from '../dtos/event.dto';
import { EventDomainService } from 'src/domain/services/event.domain-service';
import { UserDomainService } from 'src/domain/services/user.domain-service';

@Injectable()
export class EventWorkflows {
  constructor(
    private readonly eventRepo: EventRepository,
    private readonly interestedByRepo: InterestedByRepository,
    private readonly userRepo: UserRepository,
    private readonly favoritedByRepo: FavoritedByRepository,
    private readonly eventDomServ: EventDomainService,
    private readonly userDomServ: UserDomainService,
  ) {}

  async createEvent(
    { name, type, description, date, city, country, venue }: CreateEventDto,
    user: User,
  ) {}

  async editEvent({
    name,
    type,
    description,
    date,
    city,
    country,
    venue,
  }: EditEventDto) {}

  async getEvent({ event_id }: GetEventDto) {
    const event = await this.eventRepo.fetchById(event_id);
    const orgId = event.userId;

    const orgUsername = (await this.userRepo.fetchById(orgId)).username;

    const favouritedBy = await this.favoritedByRepo.fetchByEventId(event_id);
    const interestedBy = await this.interestedByRepo.fetchByEventId(event_id);

    const stats = {
      favourites: favouritedBy.length,
      interests: interestedBy.length,
    };
    return {
      result: { organizer: orgUsername, ...event, ...stats },
    };
  }

  async deleteEvent({ event_id }: DeleteEventDto) {
    const event = await this.eventRepo.fetchById(event_id);

    await this.favoritedByRepo.deleteByEventId(event_id);
    await this.interestedByRepo.deleteByEventId(event_id);
    await this.eventRepo.delete(event_id);

    return {
      message: 'Resource deleted successfully.',
    };
  }

  async addToInterestedByListOfEvent(
    { event_id }: InteractionDto,
    user: User,
  ) {}

  async deletefromInterestedByListOfEvent(
    { event_id }: InteractionDto,
    user: User,
  ) {}

  async fetchInterestedByListOfEvent({ event_id }: InteractionDto) {}

  async addToFavoritedByListOfEvent({ event_id }: InteractionDto, user: User) {
    this.userDomServ.isVerified(user);
    const favouritedBy = FavoritedBy.new(user.id, event_id);
    await this.favoritedByRepo.insert(favouritedBy);

    return {
      message: 'Resource added successfully.',
    };
  }

  async deletefromFavoritedByListOfEvent(
    { event_id }: InteractionDto,
    user: User,
  ) {
    this.favoritedByRepo.delete(user.id, event_id);

    return {
      message: 'Resource deleted successfully.',
    };
  }

  async fetchFavoritedByListOfEvent({ event_id }: InteractionDto) {
    const users = await this.favoritedByRepo.fetchByEventId(event_id);

    return users;
  }
}
