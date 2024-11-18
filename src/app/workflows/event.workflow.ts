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

@Injectable()
export class EventWorkflows {
  constructor(
    private readonly eventRepo: EventRepository,
    private readonly interestedByRepo: InterestedByRepository,
    private readonly userRepo: UserRepository,
    private readonly favoritedByRepo: FavoritedByRepository,
    private readonly eventDomServ: EventDomainService,
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

  async getEvent({ event_id }: GetEventDto) {}

  async deleteEvent({ event_id }: DeleteEventDto) {}

  async addToInterestedByListOfEvent(
    { event_id }: InteractionDto,
    user: User,
  ) {}

  async deletefromInterestedByListOfEvent(
    { event_id }: InteractionDto,
    user: User,
  ) {}

  async fetchInterestedByListOfEvent({ event_id }: InteractionDto) {}

  async addToFavoritedByListOfEvent({ event_id }: InteractionDto, user: User) {}

  async deletefromFavoritedByListOfEvent(
    { event_id }: InteractionDto,
    user: User,
  ) {}

  async fetchFavoritedByListOfEvent({ event_id }: InteractionDto) {}
}
