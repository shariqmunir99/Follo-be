import {
  Injectable,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { DrizzleDB, InjectDb } from '../db-connection';
import { eq } from 'drizzle-orm';
import { RoleRepository } from 'src/domain/entities/role/role.repository';
import { Role } from 'src/domain/entities/role/role.entity';
import { roleTbl } from '../models/role.model';
import {
  RoleAlreadyExists,
  RoleNotFound,
} from 'src/domain/entities/role/role.errors';

@Injectable()
class RoleDrizzleRepo extends RoleRepository {
  constructor(@InjectDb() private readonly db: DrizzleDB) {
    super();
  }

  async insert(entity: Role) {
    try {
      const data = entity.serialize();
      await this.db.insert(roleTbl).values(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...result } = data;
      return result;
    } catch (e) {
      throw new RoleAlreadyExists(entity.id);
    }
  }

  async fetchById(id: string) {
    try {
      const role = await this.db
        .select()
        .from(roleTbl)
        .where(eq(roleTbl.id, id));
      if (!role) {
        throw new RoleNotFound(id);
      }
      return role[0];
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async fetchByRole(roleName: string) {
    try {
      const role = await this.db
        .select()
        .from(roleTbl)
        .where(eq(roleTbl.roleName, roleName));
      if (!role) {
        throw new RoleNotFound(roleName);
      }
      return role[0];
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}

export const RoleRepoProvider: Provider<RoleRepository> = {
  provide: RoleRepository,
  useClass: RoleDrizzleRepo,
};
