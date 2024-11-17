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
  username: string;
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

  markActive() {
    if (!this.isVerified) {
      this.isVerified = true;
      return false;
    }
    return true; // Indicates that the user is already verified.
  }
  setIsVerified() {
    this.isVerified = true;
    this.markUpdated();
  }
  usernameUpdate(newUsername: string) {
    this.username = newUsername;
    this.markUpdated();
  }
  passwordUpdate(newPwHash: string) {
    this.pwHashed = newPwHash;
    this.markUpdated;
  }
  static fromSerialized(other: SerializedUser) {
    const ent = new User(
      other.username,
      other.email,
      other.pwHashed,
      other.isVerified,
      other.roleID,
    );
    ent._fromSerialized(other);

    return ent;
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
