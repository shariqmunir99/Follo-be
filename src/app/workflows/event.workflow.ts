import { Injectable } from '@nestjs/common';
import { Event } from 'src/domain/entities/event/event.entity';
import { EventRepository } from 'src/domain/entities/event/event.repository';
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
}
