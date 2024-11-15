import { Injectable } from '@nestjs/common';
import { Event } from 'src/domain/entities/event/event.entity';
import { EventRepository } from 'src/domain/entities/event/event.repository';

@Injectable()
export class EventWorkflows {
  constructor(private readonly eventRepo: EventRepository) {}

  async demo() {
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
}
