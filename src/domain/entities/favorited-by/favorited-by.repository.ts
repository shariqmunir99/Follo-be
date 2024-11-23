import { FavoritedBy, SerializedFavoritedBy } from './favorited-by.entity';

export abstract class FavoritedByRepository {
  abstract insert(entity: FavoritedBy);
  abstract fetchByEventId(id: string): Promise<{ username: string }[]>;
  abstract delete(userId: string, eventId: string);
  abstract deleteByEventId(eventId: string);
  abstract fetchByUserId(id: string): Promise<SerializedFavoritedBy[]>;
}
