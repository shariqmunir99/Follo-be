import {
  Injectable,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { DrizzleDB, InjectDb } from '../db-connection';
import { and, eq } from 'drizzle-orm';
import {
  FavoritedBy,
  SerializedFavoritedBy,
} from 'src/domain/entities/favorited-by/favorited-by.entity';
import { FavoritedByRepository } from 'src/domain/entities/favorited-by/favorited-by.repository';
import { favoritedByTbl } from '../models/favorited-by.model';
import {
  FavoritedByAlreadyExists,
  FavoritedByNotFound,
} from 'src/domain/entities/favorited-by/favorited-by.errors';
import { UserRepository } from 'src/domain/entities/user/user.repository';
import { EventRepository } from 'src/domain/entities/event/event.repository';
import { Event } from 'src/domain/entities/event/event.entity';

@Injectable()
class FavoritedByDrizzleRepo extends FavoritedByRepository {
  constructor(
    @InjectDb() private readonly db: DrizzleDB,
    private readonly userRepo: UserRepository,
    private readonly eventRepo: EventRepository,
  ) {
    super();
  }

  async insert(entity: FavoritedBy) {
    try {
      const data = entity.serialize();
      await this.db.insert(favoritedByTbl).values(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...result } = data;
      return result;
    } catch (e) {
      throw new FavoritedByAlreadyExists(entity.userId, entity.eventId);
    }
  }

  async deleteByEventId(eventId: string) {
    try {
      await this.db
        .delete(favoritedByTbl)
        .where(eq(favoritedByTbl.eventId, eventId));
    } catch (e) {
      if (!(e instanceof FavoritedByNotFound)) {
        console.log(e.message);
        throw new InternalServerErrorException();
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }

  async deleteByUserId(userId: string) {
    try {
      await this.db
        .delete(favoritedByTbl)
        .where(eq(favoritedByTbl.userId, userId));
    } catch (e) {
      if (!(e instanceof FavoritedByNotFound)) {
        console.log(e.message);
        throw new InternalServerErrorException();
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }

  async delete(userId: string, eventId: string) {
    try {
      await this.db
        .delete(favoritedByTbl)
        .where(
          and(
            eq(favoritedByTbl.userId, userId),
            eq(favoritedByTbl.eventId, eventId),
          ),
        );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new FavoritedByNotFound(userId);
    }
  }

  async fetchByUserId(id: string): Promise<SerializedFavoritedBy[]> {
    try {
      const favoritedBy = await this.db
        .select()
        .from(favoritedByTbl)
        .where(eq(favoritedByTbl.userId, id));

      return favoritedBy; //Returns the list of all the events ID's favorited by the user.
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async fetchPaginatedByUserId(id: string, offset: number, limit: number) {
    try {
      // Fetching the events the user is interested in
      const interestedBy = await this.db
        .select()
        .from(favoritedByTbl)
        .where(eq(favoritedByTbl.userId, id))
        .limit(limit)
        .offset(offset);

      // Fetch event names in parallel for all interested events
      const events = await Promise.all(
        interestedBy.map(
          async (row) =>
            (await this.eventRepo.fetchById(row.eventId)).serialize(), // Make sure to use `eventId`
        ),
      );
      // Return the list of event names
      return events;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async fetchByEventId(id: string): Promise<{ username: string }[]> {
    try {
      const favoritedBy = await this.db
        .select()
        .from(favoritedByTbl)
        .where(eq(favoritedByTbl.eventId, id));
      if (!favoritedBy) {
        throw new FavoritedByNotFound(id, 'eventId');
      }

      const users = await Promise.all(
        favoritedBy.map(async (row) => {
          const { username, profilePicUrl } = await this.userRepo.fetchById(
            row.userId,
          );
          const temp = {
            userId: row.userId,
            username,
            profilePic: profilePicUrl,
          };
          return temp;
        }),
      );

      return users; //Returns the usernames
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}

export const FavoritedByRepoProvider: Provider<FavoritedByRepository> = {
  provide: FavoritedByRepository,
  useClass: FavoritedByDrizzleRepo,
};
