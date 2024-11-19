import { Injectable } from '@nestjs/common';
import { EditEventDto } from 'src/app/dtos/event.dto';
import { Event } from '../entities/event/event.entity';

@Injectable()
export class EventDomainService {
  async editEvent(
    newname,
    newtype,
    newdescription,
    newdate,
    newcity,
    newcountry,
    newvenue,
    event: Event,
  ) {
    if (newname) {
      event.nameUpdate(newname);
    }
    if (newtype) {
      event.typeUpdate(newtype);
    }
    if (newdescription) {
      event.descriptionUpdate(newdescription);
    }
    if (newdate) {
      event.dateUpdate(newdate);
    }
    if (newcity) {
      event.cityUpdate(newcity);
    }
    if (newcountry) {
      event.countryUpdate(newcountry);
    }
    if (newvenue) {
      event.venueUpdate(newvenue);
    }
    return event;
  }
}
