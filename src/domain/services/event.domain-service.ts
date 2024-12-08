import { Injectable } from '@nestjs/common';
import { Event } from '../entities/event/event.entity';
import { GoogleDriveUploadService } from 'src/app/services/other-services/google-upload.service';

@Injectable()
export class EventDomainService {
  constructor(private readonly googleDriveServ: GoogleDriveUploadService) {}

  async editEvent(
    newName: string | null,
    newType: string | null,
    newDescription: string | null,
    newDate: string | null,
    newCity: string | null,
    newCountry: string | null,
    newVenue: string | null,
    event: Event,
    image: boolean | null,
    file: Express.Multer.File,
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

    if (file && image) {
      try {
        await this.googleDriveServ.deleteImage(event.imageUrl.split('?id=')[1]);
        const picId = await this.googleDriveServ.uploadImage(file);
        event.imageUpdate(picId);
      } catch (e) {
        console.log(e);
      }
    }

    return event;
  }
}
