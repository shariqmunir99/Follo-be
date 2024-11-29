import {
  Injectable,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { UserRepository } from 'src/domain/entities/user/user.repository';
import { DrizzleDB, InjectDb } from '../db-connection';
import { User } from 'src/domain/entities/user/user.entity';
import { userTbl } from '../models/user.model';
import { eq } from 'drizzle-orm';
import {
  UserAlreadyExists,
  UserNotFound,
} from 'src/domain/entities/user/user.errors';
import { DatabaseUser } from 'src/infra/types';

@Injectable()
class UserDrizzleRepo extends UserRepository {
  constructor(@InjectDb() private readonly db: DrizzleDB) {
    super();
  }

  async update(entity: User) {
    const data = entity.forUpdate();
    try {
      await this.db.update(userTbl).set(data).where(eq(userTbl.id, entity.id));
      return entity; // Return the User as is in case of successful Updation.
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async insert(entity: User): Promise<Omit<DatabaseUser, 'pwHashed'>> {
    try {
      const data = entity.serialize();
      await this.db.insert(userTbl).values(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pwHashed, ...result } = data;
      return result; // Return the User as is in case of successful insertion but make sure to not return the password hash due to security concerns .
    } catch (e) {
      console.log(e.message);
      //If we are in this block then it means the unique constraint was violated or in simpler words, the user already exists. Now we check for which field violated the constraint.
      const isUsernameErr = e.message.includes('username');
      const [identifier, field] = isUsernameErr
        ? ([entity.username, 'username'] as const)
        : ([entity.email, 'email'] as const);

      throw new UserAlreadyExists(identifier, field);
    }
  }

  async delete(id: string) {
    try {
      await this.db.delete(userTbl).where(eq(userTbl.id, id));
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async fetchById(id: string): Promise<User> {
    try {
      const user = await this.db
        .select()
        .from(userTbl)
        .where(eq(userTbl.id, id));
      if (!user) {
        throw new UserNotFound(id);
      }
      return User.fromSerialized(user[0]); // Return the User as is in case of successful insertion.
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async fetchByEmail(email: string): Promise<User> {
    try {
      const user = await this.db
        .select()
        .from(userTbl)
        .where(eq(userTbl.email, email));
      if (!user) {
        throw new UserNotFound(email);
      }
      return User.fromSerialized(user[0]); // Return the User as is in case of successful Fetch.
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}

export const UserRepoProvider: Provider<UserRepository> = {
  provide: UserRepository,
  useClass: UserDrizzleRepo,
};
