import {
  Injectable,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { DrizzleDB, InjectDb } from '../db-connection';
import { and, eq, gt } from 'drizzle-orm';
import { FavoritedByNotFound } from 'src/domain/entities/favorited-by/favorited-by.errors';
import { FollowRepository } from 'src/domain/entities/follow/follow.repository';
import {
  Follow,
  SerializedFollow,
} from 'src/domain/entities/follow/follow.entity';
import { followTbl } from '../models/follow.model';
import {
  FollowAlreadyExists,
  FollowNotFound,
} from 'src/domain/entities/follow/follow.errors';

@Injectable()
class FollowDrizzleRepo extends FollowRepository {
  constructor(@InjectDb() private readonly db: DrizzleDB) {
    super();
  }

  async insert(entity: Follow) {
    try {
      const data = entity.serialize();
      await this.db.insert(followTbl).values(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...result } = data;
      return result;
    } catch (e) {
      throw new FollowAlreadyExists(entity.followerId, entity.followingId);
    }
  }

  async delete(organizerId: string, userId: string) {
    try {
      await this.db
        .delete(followTbl)
        .where(
          and(
            eq(followTbl.followingId, organizerId),
            eq(followTbl.followerId, userId),
          ),
        );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new FollowNotFound(organizerId);
    }
  }

  async deleteByFollowerId(userId: string) {
    try {
      await this.db.delete(followTbl).where(eq(followTbl.followerId, userId));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new InternalServerErrorException(userId);
    }
  }

  async deleteByFollowingId(organizerId: string) {
    try {
      await this.db
        .delete(followTbl)
        .where(eq(followTbl.followingId, organizerId));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new InternalServerErrorException(organizerId);
    }
  }

  async fetchFollowers(organizerId: string): Promise<SerializedFollow[]> {
    try {
      const followers = await this.db
        .select()
        .from(followTbl)
        .where(eq(followTbl.followingId, organizerId));
      if (!followers) {
        throw new FollowNotFound(organizerId, 'organizerId');
      }
      return followers; //Returns the list of all the user ID's that follow the organizer.
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async fetchFollowing(userId: string): Promise<SerializedFollow[]> {
    try {
      const following = await this.db
        .select()
        .from(followTbl)
        .where(eq(followTbl.followerId, userId));

      return following; //Returns the list of all the organizer ID's that are being by the user.
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getRecentFollowersCount(orgId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    try {
      const followers = await this.db
        .select()
        .from(followTbl)
        .where(
          and(
            gt(followTbl.createdAt, thirtyDaysAgo),
            eq(followTbl.followingId, orgId),
          ),
        );
      return followers.length;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}

export const FollowRepoProvider: Provider<FollowRepository> = {
  provide: FollowRepository,
  useClass: FollowDrizzleRepo,
};
