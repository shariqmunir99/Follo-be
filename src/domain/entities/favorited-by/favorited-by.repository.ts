import { FavoritedBy, SerializedFavoritedBy } from './favorited-by.entity';

export abstract class FavoritedByRepository {
  abstract insert(entity: FavoritedBy);
  abstract delete(id: string);
  abstract fetchByEventId(id: string);
  abstract removeFromFavorited(userId: string, eventId: string);
  abstract deleteByEventId(eventId: string);
  abstract fetchByUserId(id: string): Promise<SerializedFavoritedBy[]>;
}
