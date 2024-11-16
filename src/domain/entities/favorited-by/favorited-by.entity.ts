import { BaseEntity, IEntity, SimpleSerialized } from '@carbonteq/hexapp';

export interface IFavoritedBy extends IEntity {
  userId: string;
  eventId: string;
}
export type SerializedFavoritedBy = SimpleSerialized<IFavoritedBy>;

export class FavoritedBy extends BaseEntity implements IFavoritedBy {
  private constructor(
    readonly userId: string,
    readonly eventId: string,
  ) {
    super();
  }

  static new(userId: string, eventId: string) {
    return new FavoritedBy(userId, eventId);
  }

  serialize(): SerializedFavoritedBy {
    return {
      ...super._serialize(),
      userId: this.userId,
      eventId: this.eventId,
    };
  }
}
