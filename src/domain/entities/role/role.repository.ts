import { Role } from './role.entity';

export abstract class RoleRepository {
  abstract insert(entity: Role);
  abstract fetchById(id: string);
  abstract fetchByRole(roleName: Role['roleName']);
}
