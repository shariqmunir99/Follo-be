import { Follow, SerializedFollow } from './follow.entity';

export abstract class FollowRepository {
  abstract insert(entity: Follow);
  abstract delete(id: string);
  abstract fetchFollowers(organizerID: string): Promise<SerializedFollow[]>;
  abstract fetchFollowing(userId: string): Promise<SerializedFollow[]>;
}
