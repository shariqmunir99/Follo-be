import {
  Injectable,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { DrizzleDB, InjectDb } from '../db-connection';
import { and, eq, inArray, ne, notInArray, sql } from 'drizzle-orm';
import { EventRepository } from 'src/domain/entities/event/event.repository';
import { Event, SerializedEvent } from 'src/domain/entities/event/event.entity';
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

  async insert(entity: Event): Promise<SerializedEvent> {
    try {
      const data = entity.serialize();
      await this.db.insert(eventTbl).values(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return data; // Return the Event as is in case of successful insertion but make sure to not return the password hash due to security concerns .
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

  async fetchByOrganizerId(orgId: string) {
    try {
      const event = await this.db
        .select()
        .from(eventTbl)
        .where(eq(eventTbl.userId, orgId));
      if (!event) {
        throw new EventNotFound(orgId);
      }
      return event; // returns the list of all events created by an organizer
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async fetchPaginatedByOrgId(orgIds: string[], offset: number, limit: number) {
    try {
      const event = await this.db
        .select()
        .from(eventTbl)
        .where(inArray(eventTbl.userId, orgIds))
        .limit(limit)
        .offset(offset);

      return event; // returns the list of all events created by an organizer
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async fetchPaginatedEventsByLocation(
    location: string,
    offset: number,
    limit: number,
  ) {
    try {
      const event = await this.db
        .select()
        .from(eventTbl)
        .where(eq(eventTbl.city, location))
        .limit(limit)
        .offset(offset);

      return event; // returns the list of all events created by an organizer
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async fetchPaginatedEventsExceptLocation(
    location: string,
    offset: number,
    limit: number,
    excludeOrgIds: string[] = [],
    except: boolean,
  ) {
    const condition = except
      ? ne(eventTbl.city, location)
      : eq(eventTbl.city, location);

    return this.db
      .select()
      .from(eventTbl)
      .where(and(condition, notInArray(eventTbl.userId, excludeOrgIds)))
      .offset(offset)
      .limit(limit);
  }
}

export const EventRepoProvider: Provider<EventRepository> = {
  provide: EventRepository,
  useClass: EventDrizzleRepo,
};
