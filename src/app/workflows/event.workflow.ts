import { Injectable } from '@nestjs/common';
import { Event } from 'src/domain/entities/event/event.entity';
import { EventRepository } from 'src/domain/entities/event/event.repository';
import { FavoritedBy } from 'src/domain/entities/favorited-by/favorited-by.entity';
import { FavoritedByRepository } from 'src/domain/entities/favorited-by/favorited-by.repository';
import { InterestedBy } from 'src/domain/entities/interested-by/interested-by.entity';
import { InterestedByRepository } from 'src/domain/entities/interested-by/interested-by.repository';
import { User } from 'src/domain/entities/user/user.entity';
import { UserRepository } from 'src/domain/entities/user/user.repository';

@Injectable()
export class EventWorkflows {
  constructor(
    private readonly eventRepo: EventRepository,
    private readonly interestedByRepo: InterestedByRepository,
    private readonly userRepo: UserRepository,
    private readonly favoritedByRepo: FavoritedByRepository,
  ) {}

  async demoCreate() {
    const event = Event.new(
      'Lost Soul',
      'Concert',
      'Come and find your lost souls',
      new Date(Date.now()),
      'Lahore',
      'Pakistan',
      'PC Hotel',
      'b80fa63f-4d82-49f6-a09f-df24bf517ccc',
    );
    const result = await this.eventRepo.insert(event);
    return {
      result,
    };
  }

  async demoDelete(id: string) {
    await this.eventRepo.delete(id);
    return {
      message: 'Delete Successful',
    };
  }

  async demoCreateInterestedBy(userId: string, eventid: string) {
    const interestedBy = InterestedBy.new(userId, eventid);
    const result = await this.interestedByRepo.insert(interestedBy);
    return {
      result,
    };
  }

  async demoDeleteInterestedBy(id: string) {
    await this.interestedByRepo.delete(id);
    return {
      result: 'Deletion succesful',
    };
  }

  async demoFetchInterestedByUser(userId: string) {
    const interestedByList = await this.interestedByRepo.fetchByUserId(userId);
    const result: User[] = await Promise.all(
      interestedByList.map((interestedByEntity) =>
        this.userRepo.fetchById(interestedByEntity.userId),
      ),
    );
    return {
      result,
    };
  }

  async demoFetchInterestedByEvent(eventId: string) {
    const result = await this.interestedByRepo.fetchByEventId(eventId);
    return {
      result,
    };
  }

  async demoCreateFavoritedBy(userId: string, eventid: string) {
    const favoritedBy = FavoritedBy.new(userId, eventid);
    const result = await this.favoritedByRepo.insert(favoritedBy);
    return {
      result,
    };
  }

  async demoDeleteFavoritedBy(id: string) {
    await this.favoritedByRepo.delete(id);
    return {
      result: 'Deletion succesful',
    };
  }

  async demoFetchFavoritedByUser(userId: string) {
    const favoritedByList = await this.favoritedByRepo.fetchByUserId(userId);
    const result: User[] = await Promise.all(
      favoritedByList.map((favoritedByEntity) =>
        this.userRepo.fetchById(favoritedByEntity.userId),
      ),
    );
    return {
      result,
    };
  }

  async demoFetchFavoritedByEvent(eventId: string) {
    const result = await this.favoritedByRepo.fetchByEventId(eventId);
    return {
      result,
    };
  }
}
