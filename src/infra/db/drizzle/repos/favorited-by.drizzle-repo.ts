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
import { FavoritedByNotFound } from 'src/domain/entities/favorited-by/favorited-by.errors';
import { UserRepository } from 'src/domain/entities/user/user.repository';

@Injectable()
class FavoritedByDrizzleRepo extends FavoritedByRepository {
  constructor(
    @InjectDb() private readonly db: DrizzleDB,
    private readonly userRepo: UserRepository,
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
      console.log(e.message);
      throw new FavoritedByNotFound(entity.id);
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
      if (!favoritedBy) {
        throw new FavoritedByNotFound(id, 'userId');
      }
      return favoritedBy; //Returns the list of all the events ID's favorited by the user.
    } catch (e) {
      throw new InternalServerErrorException();
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
          const { username } = await this.userRepo.fetchById(row.userId);
          const temp = { username };
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
