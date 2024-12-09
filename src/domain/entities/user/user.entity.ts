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
  location: string;
}
export type SerializedUser = SimpleSerialized<IUser>;
type UserUpdateData = Omitt<IUser, 'id' | 'createdAt' | 'email' | 'roleID'>;

export class User extends BaseEntity implements IUser {
  pwHashed: string;
  isVerified: boolean;
  username: string;
  location: string;
  private constructor(
    username: string,
    readonly email: string,
    pwHashed: string,
    isVerified: boolean,
    readonly roleID: string,
    location: string,
  ) {
    super();
    this.username = username;
    this.pwHashed = pwHashed;
    this.isVerified = isVerified;
    this.location = location;
  }

  static new(
    username: string,
    email: string,
    pwHashed: string,
    roleID: string,
    location: string,
  ) {
    return new User(username, email, pwHashed, false, roleID, location);
  }

  forUpdate(): UserUpdateData {
    return {
      ...super.forUpdate(),
      username: this.username,
      pwHashed: this.pwHashed,
      isVerified: this.isVerified,
      location: this.location,
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
  locationUpdate(newLocation: string) {
    this.location = newLocation;
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
      other.location,
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
      location: this.location,
    };
  }
}
