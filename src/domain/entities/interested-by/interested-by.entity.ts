import { BaseEntity, IEntity, SimpleSerialized } from '@carbonteq/hexapp';

export interface IInterestedBy extends IEntity {
  userId: string;
  eventId: string;
}
export type SerializedInterestedBy = SimpleSerialized<IInterestedBy>;

export class InterestedBy extends BaseEntity implements IInterestedBy {
  private constructor(
    readonly userId: string,
    readonly eventId: string,
  ) {
    super();
  }

  static new(userId: string, eventId: string) {
    return new InterestedBy(userId, eventId);
  }

  serialize(): SerializedInterestedBy {
    return {
      ...super._serialize(),
      userId: this.userId,
      eventId: this.eventId,
    };
  }
}
