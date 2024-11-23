import { Injectable } from '@nestjs/common';

import { EditEventDto } from 'src/app/dtos/event.dto';
import { EventRepository } from '../entities/event/event.repository';


@Injectable()
export class EventDomainService {
  async editEvent(
    newName: string | null,
    newType: string | null,
    newDescription: string | null,
    newDate: string | null,
    newCity: string | null,
    newCountry: string | null,
    newVenue: string | null,
    event: Event,
  ) {
    if (newName) {
      event.nameUpdate(newName);
    }
    if (newType) {
      event.typeUpdate(newType);
    }
    if (newDescription) {
      event.descriptionUpdate(newDescription);
    }
    if (newDate) {
      event.dateUpdate(newDate);
    }
    if (newCity) {
      event.cityUpdate(newCity);
    }
    if (newCountry) {
      event.countryUpdate(newCountry);
    }
    if (newVenue) {
      event.venueUpdate(newVenue);
    }
    return event;
  }
}
