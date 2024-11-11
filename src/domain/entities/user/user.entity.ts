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
  roleID: string;
}
export type SerializedUser = SimpleSerialized<IUser>;
type UserUpdateData = Omitt<IUser, 'id' | 'createdAt' | 'email' | 'roleID'>;

export class User extends BaseEntity implements IUser {
  pwHashed: string;
  isVerified: boolean;
  username;
  private constructor(
    username: string,
    readonly email: string,
    pwHashed: string,
    isVerified: boolean,
    readonly roleID: string,
  ) {
    super();
    this.username = username;
    this.pwHashed = pwHashed;
    this.isVerified = isVerified;
  }

  static new(
    username: string,
    email: string,
    pwHashed: string,
    roleID: string,
  ) {
    return new User(username, email, pwHashed, false, roleID);
  }

  forUpdate(): UserUpdateData {
    return {
      ...super.forUpdate(),
      username: this.username,
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
      roleID: this.roleID,
    };
  }
}
