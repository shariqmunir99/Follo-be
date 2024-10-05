import { User } from './user.entity';

export abstract class UserRepository {
  abstract update(entity: User);
  abstract insert(entity: User);
  abstract fetchById(id: User['id']);
  abstract fetchByEmail(id: User['email']);
}
