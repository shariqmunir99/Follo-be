import {
  Injectable,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { DrizzleDB, InjectDb } from '../db-connection';
import { userTbl } from '../models/user.model';
import { eq } from 'drizzle-orm';
import { EventRepository } from 'src/domain/entities/event/event.repository';
import { Event } from 'src/domain/entities/event/event.entity';
import { eventTbl } from '../models/event.model';
import { EventNotFound } from 'src/domain/entities/event/event.errors';

@Injectable()
class EventDrizzleRepo extends EventRepository {
  constructor(@InjectDb() private readonly db: DrizzleDB) {
    super();
  }

  async update(entity: Event) {
    const data = entity.forUpdate();
    try {
      await this.db
        .update(eventTbl)
        .set(data)
        .where(eq(eventTbl.id, entity.id));
      return entity; // Return the Event as is in case of successful Updation.
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async delete(id: string) {
    try {
      await this.db.delete(eventTbl).where(eq(eventTbl.id, id));
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async insert(entity: Event): Promise<Event> {
    try {
      const data = entity.serialize();
      await this.db.insert(eventTbl).values(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return entity; // Return the Event as is in case of successful insertion but make sure to not return the password hash due to security concerns .
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException();
    }
  }

  async fetchById(id: string): Promise<Event> {
    try {
      const event = await this.db
        .select()
        .from(eventTbl)
        .where(eq(eventTbl.id, id));
      if (!event) {
        throw new EventNotFound(id);
      }
      return Event.fromSerialized(event[0]); // Return the User as is in case of successful insertion.
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}

export const EventRepoProvider: Provider<EventRepository> = {
  provide: EventRepository,
  useClass: EventDrizzleRepo,
};
