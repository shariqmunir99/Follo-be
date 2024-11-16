import {
  Injectable,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { DrizzleDB, InjectDb } from '../db-connection';
import { eq } from 'drizzle-orm';
import { InterestedByRepository } from 'src/domain/entities/interested-by/interested-by.repository';
import {
  InterestedBy,
  SerializedInterestedBy,
} from 'src/domain/entities/interested-by/interested-by.entity';
import { interestedByTbl } from '../models/interested-by.model';
import { InterestedByNotFound } from 'src/domain/entities/interested-by/interested-by.errors';

@Injectable()
class InterestedByDrizzleRepo extends InterestedByRepository {
  constructor(@InjectDb() private readonly db: DrizzleDB) {
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

  async delete(id: string) {
    try {
      await this.db.delete(interestedByTbl).where(eq(interestedByTbl.id, id));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new InterestedByNotFound(id);
    }
  }

  async fetchByUserId(id: string): Promise<SerializedInterestedBy[]> {
    try {
      const interestedBy = await this.db
        .select()
        .from(interestedByTbl)
        .where(eq(interestedByTbl.userId, id));
      if (!interestedBy) {
        throw new InterestedByNotFound(id, 'userId');
      }
      return interestedBy; //Returns the list of all the events ID's interested by the user.
    } catch (e) {
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
      return interestedBy; //Returns the list of all the user ID's that have interested the event.
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}

export const InterestedByRepoProvider: Provider<InterestedByRepository> = {
  provide: InterestedByRepository,
  useClass: InterestedByDrizzleRepo,
};
