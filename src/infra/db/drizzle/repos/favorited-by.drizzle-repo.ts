import {
  Injectable,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { DrizzleDB, InjectDb } from '../db-connection';
import { eq } from 'drizzle-orm';
import {
  FavoritedBy,
  SerializedFavoritedBy,
} from 'src/domain/entities/favorited-by/favorited-by.entity';
import { FavoritedByRepository } from 'src/domain/entities/favorited-by/favorited-by.repository';
import { favoritedByTbl } from '../models/favorited-by.model';
import { FavoritedByNotFound } from 'src/domain/entities/favorited-by/favorited-by.errors';

@Injectable()
class FavoritedByDrizzleRepo extends FavoritedByRepository {
  constructor(@InjectDb() private readonly db: DrizzleDB) {
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

  async delete(id: string) {
    try {
      await this.db.delete(favoritedByTbl).where(eq(favoritedByTbl.id, id));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new FavoritedByNotFound(id);
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

  async fetchByEventId(id: string) {
    try {
      const favoritedBy = await this.db
        .select()
        .from(favoritedByTbl)
        .where(eq(favoritedByTbl.eventId, id));
      if (!favoritedBy) {
        throw new FavoritedByNotFound(id, 'eventId');
      }

      //extracting the user id's
      let users = [];
      for (var index in favoritedBy) {
        // console.log(favoritedBy[index]);
        let temp = favoritedBy[index].userId;
        users.push(temp);
      }

      return users; //Returns the list of all the user ID's that have favorited the event.
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}

export const FavoritedByRepoProvider: Provider<FavoritedByRepository> = {
  provide: FavoritedByRepository,
  useClass: FavoritedByDrizzleRepo,
};
