import {
  Injectable,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { DrizzleDB, InjectDb } from '../db-connection';
import { and, eq } from 'drizzle-orm';
import { InterestedByRepository } from 'src/domain/entities/interested-by/interested-by.repository';
import { InterestedBy } from 'src/domain/entities/interested-by/interested-by.entity';
import { interestedByTbl } from '../models/interested-by.model';
import { InterestedByNotFound } from 'src/domain/entities/interested-by/interested-by.errors';
import { Event } from 'src/domain/entities/event/event.entity';
import { UserRepository } from 'src/domain/entities/user/user.repository';
import { EventRepository } from 'src/domain/entities/event/event.repository';

@Injectable()
class InterestedByDrizzleRepo extends InterestedByRepository {
  constructor(
    @InjectDb() private readonly db: DrizzleDB,
    private readonly userRepo: UserRepository,
    private readonly eventRepo: EventRepository,
  ) {
    super();
  }

  async insert(entity: InterestedBy) {
    try {
      const data = entity.serialize();
      await this.db.insert(interestedByTbl).values(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...result } = data;
      return result;
    } catch (e) {
      throw new InterestedByNotFound(entity.id);
    }
  }

  async delete(userId: string, eventId: string) {
    try {
      await this.db
        .delete(interestedByTbl)
        .where(
          and(
            eq(interestedByTbl.userId, userId),
            eq(interestedByTbl.eventId, eventId),
          ),
        );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new InterestedByNotFound(userId);
    }
  }

  async fetchByUserId(id: string): Promise<Event[]> {
    try {
      // Fetching the events the user is interested in
      const interestedBy = await this.db
        .select()
        .from(interestedByTbl)
        .where(eq(interestedByTbl.userId, id));

      // Check if the user is not interested in any events
      if (interestedBy.length === 0) {
        throw new InterestedByNotFound(id, 'userId');
      }

      // Fetch event names in parallel for all interested events
      const events = await Promise.all(
        interestedBy.map(
          async (row) => await this.eventRepo.fetchById(row.eventId), // Make sure to use `eventId`
        ),
      );

      // Return the list of event names
      return events;
    } catch (e) {
      // Log or handle error if needed, but always rethrow the exception
      throw new InternalServerErrorException();
    }
  }
  async fetchByEventId(id: string) {
    try {
      const interestedBy = await this.db
        .select()
        .from(interestedByTbl)
        .where(eq(interestedByTbl.eventId, id));
      if (!interestedBy) {
        throw new InterestedByNotFound(id, 'eventId');
      }

      const users = await Promise.all(
        interestedBy.map(async (row) => {
          const { username } = await this.userRepo.fetchById(row.userId);
          const temp = { username };
          return temp;
        }),
      );
      return users; //Returns the list of all the user names that have interested the event.
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}

export const InterestedByRepoProvider: Provider<InterestedByRepository> = {
  provide: InterestedByRepository,
  useClass: InterestedByDrizzleRepo,
};
