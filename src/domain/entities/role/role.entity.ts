import { BaseEntity, IEntity, SimpleSerialized } from '@carbonteq/hexapp';

export interface IRole extends IEntity {
  roleName: string;
}
export type SerializedRole = SimpleSerialized<IRole>;

export class Role extends BaseEntity implements IRole {
  private constructor(readonly roleName: string) {
    super();
  }

  static new(roleName: string) {
    return new Role(roleName);
  }

  serialize(): SerializedRole {
    return {
      ...super._serialize(),
      roleName: this.roleName,
    };
  }
}
