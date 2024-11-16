import { FavoritedBy, SerializedFavoritedBy } from './favorited-by.entity';

export abstract class FavoritedByRepository {
  abstract insert(entity: FavoritedBy);
  abstract delete(id: string);
  abstract fetchByEventId(id: string);
  abstract fetchByUserId(id: string): Promise<SerializedFavoritedBy[]>;
}
