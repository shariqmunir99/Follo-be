import { User } from './user.entity';

export abstract class UserRepository {
  abstract update(entity: User);
  abstract insert(entity: User);
  abstract delete(id: string);
  abstract fetchById(id: User['id'] | string): Promise<User>;
  abstract fetchByEmail(id: User['email']): Promise<User>;
}
