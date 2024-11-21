import {
  Injectable,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { DrizzleDB, InjectDb } from '../db-connection';
import { and, eq } from 'drizzle-orm';
import { InterestedByRepository } from 'src/domain/entities/interested-by/interested-by.repository';
import {
  InterestedBy,
  SerializedInterestedBy,
} from 'src/domain/entities/interested-by/interested-by.entity';
import { interestedByTbl } from '../models/interested-by.model';
import { InterestedByNotFound } from 'src/domain/entities/interested-by/interested-by.errors';
import { UserRepository } from 'src/domain/entities/user/user.repository';

@Injectable()
class InterestedByDrizzleRepo extends InterestedByRepository {
  constructor(
    @InjectDb() private readonly db: DrizzleDB,
    private readonly userRepo: UserRepository,
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

  async deleteByEventId(eventId: string) {
    try {
      await this.db
        .delete(interestedByTbl)
        .where(eq(interestedByTbl.eventId, eventId));
    } catch (e) {
      if (!(e instanceof InterestedByNotFound)) {
        console.log(e.message);
        throw new InternalServerErrorException();
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      const users = await Promise.all(
        interestedBy.map(async (row) => {
          const { username } = await this.userRepo.fetchById(row.userId);
          const temp = { username };
          return temp;
        }),
      );
      return users; //Returns the list of all the user ID's that have interested the event.
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}

export const InterestedByRepoProvider: Provider<InterestedByRepository> = {
  provide: InterestedByRepository,
  useClass: InterestedByDrizzleRepo,
};
