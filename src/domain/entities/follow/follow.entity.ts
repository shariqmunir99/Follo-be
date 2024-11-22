import { BaseEntity, IEntity, SimpleSerialized } from '@carbonteq/hexapp';

export interface IFollow extends IEntity {
  followerId: string;
  followingId: string;
}
export type SerializedFollow = SimpleSerialized<IFollow>;

export class Follow extends BaseEntity implements IFollow {
  private constructor(
    readonly followerId: string,
    readonly followingId: string,
  ) {
    super();
  }

  static new(userId: string, orgId: string) {
    return new Follow(userId, orgId);
  }

  serialize(): SerializedFollow {
    return {
      ...super._serialize(),
      followerId: this.followerId,
      followingId: this.followingId,
    };
  }
}
