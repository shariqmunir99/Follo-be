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
    return new ResetRequest(userId, genExp(), true);
  }

  forUpdate(): ResetRequestUpdateData {
    return {
      ...super.forUpdate(),
      active: this.active,
    };
  }

  guardAgainstExpiry() {
    if (this.expiryDate < new Date(Date.now())) {
      return true;
    }
    return false; //Indicates that the request is not expired
  }
  markInactive() {
    if (this.active) {
      this.active = false;
      this.markUpdated();
      return true;
    }
    return false; // False indicates that this request has already been verified.
  }

  static fromSerialized(other: SerializedResetRequest) {
    const ent = new ResetRequest(other.userId, other.expiryDate, other.active);
    ent._fromSerialized(other);
    return ent;
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
