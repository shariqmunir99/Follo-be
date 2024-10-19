import { BaseEntity, IEntity, SimpleSerialized } from '@carbonteq/hexapp';

export interface IResetRequest extends IEntity {
  userId: string;
  expiryDate: Date;
  active: boolean;
}
export type SerializedResetRequest = SimpleSerialized<IResetRequest>;
type ResetRequestUpdateData = Pick<IResetRequest, 'active' | 'updatedAt'>;

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const genExp = () => new Date(Date.now() + ONE_WEEK_MS);

export class ResetRequest extends BaseEntity implements IResetRequest {
  active: boolean;
  private constructor(
    readonly userId: string,
    readonly expiryDate: Date,
    active: boolean,
  ) {
    super();
    this.active = active;
  }

  static new(userId: string) {
    return new ResetRequest(userId, genExp(), false);
  }

  forUpdate(): ResetRequestUpdateData {
    return {
      ...super.forUpdate(),
      active: this.active,
    };
  }

  serialize(): SerializedResetRequest {
    return {
      ...super._serialize(),
      userId: this.userId,
      expiryDate: this.expiryDate,
      active: this.active,
    };
  }
}
