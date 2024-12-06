import {
  BaseEntity,
  IEntity,
  SimpleSerialized,
  Omitt,
} from '@carbonteq/hexapp';
export const defaultProfilePic =
  'https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg';
export interface IUser extends IEntity {
  username: string;
  email: string;
  pwHashed: string;
  isVerified: boolean;
  roleID: string;
  location: string;
  profilePicUrl: string;
}
export type SerializedUser = SimpleSerialized<IUser>;
type UserUpdateData = Omitt<IUser, 'id' | 'createdAt' | 'email' | 'roleID'>;

export class User extends BaseEntity implements IUser {
  pwHashed: string;
  isVerified: boolean;
  username: string;
  profilePicUrl: string;
  location: string;
  private constructor(
    username: string,
    readonly email: string,
    pwHashed: string,
    isVerified: boolean,
    readonly roleID: string,
    location: string,
    profilePicUrl: string,
  ) {
    super();
    this.username = username;
    this.pwHashed = pwHashed;
    this.isVerified = isVerified;
    this.location = location;
    this.profilePicUrl = profilePicUrl;
  }

  static new(
    username: string,
    email: string,
    pwHashed: string,
    roleID: string,
    location: string,
    profilePicUrl: string,
  ) {
    return new User(
      username,
      email,
      pwHashed,
      false,
      roleID,
      location,
      profilePicUrl,
    );
  }

  forUpdate(): UserUpdateData {
    return {
      ...super.forUpdate(),
      username: this.username,
      pwHashed: this.pwHashed,
      isVerified: this.isVerified,
      location: this.location,
      profilePicUrl: this.profilePicUrl,
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
  profilePicUpdate(newProfilePic: string) {
    this.profilePicUrl = newProfilePic;
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
      other.profilePicUrl,
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
      profilePicUrl: this.profilePicUrl,
    };
  }
}
