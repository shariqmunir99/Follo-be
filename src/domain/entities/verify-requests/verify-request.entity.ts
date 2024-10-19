import { BaseEntity, IEntity, SimpleSerialized } from '@carbonteq/hexapp';

export interface IVerifyRequest extends IEntity {
  userId: string;
  expiryDate: Date;
  active: boolean;
}
export type SerializedVerifyRequest = SimpleSerialized<IVerifyRequest>;
type VerifyRequestUpdateData = Pick<IVerifyRequest, 'active' | 'updatedAt'>;

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const genExp = () => new Date(Date.now() + ONE_WEEK_MS);

export class VerifyRequest extends BaseEntity implements IVerifyRequest {
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
    return new VerifyRequest(userId, genExp(), false);
  }

  forUpdate(): VerifyRequestUpdateData {
    return {
      ...super.forUpdate(),
      active: this.active,
    };
  }

  serialize(): SerializedVerifyRequest {
    return {
      ...super._serialize(),
      userId: this.userId,
      expiryDate: this.expiryDate,
      active: this.active,
    };
  }
}
