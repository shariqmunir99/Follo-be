import {
  BaseEntity,
  IEntity,
  SimpleSerialized,
  Omitt,
} from '@carbonteq/hexapp';

export interface IUser extends IEntity {
  username: string;
  email: string;
  pwHashed: string;
  isVerified: boolean;
}
export type SerializedUser = SimpleSerialized<IUser>;
type UserUpdateData = Omitt<IUser, 'id' | 'createdAt' | 'username'>;

export class User extends BaseEntity implements IUser {
  email: string;
  pwHashed: string;
  isVerified: boolean;
  private constructor(
    readonly username: string,
    email: string,
    pwHashed: string,
    isVerified: boolean,
  ) {
    super();
    this.email = email;
    this.pwHashed = pwHashed;
    this.isVerified = isVerified;
  }

  static new(username: string, email: string, pwHashed: string) {
    return new User(username, email, pwHashed, false);
  }

  forUpdate(): UserUpdateData {
    return {
      ...super.forUpdate(),
      email: this.email,
      pwHashed: this.pwHashed,
      isVerified: this.isVerified,
    };
  }

  serialize(): SerializedUser {
    return {
      ...super._serialize(),
      username: this.username,
      email: this.email,
      pwHashed: this.pwHashed,
      isVerified: this.isVerified,
    };
  }
}
