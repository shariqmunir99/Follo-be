import { ResetRequest } from 'src/domain/entities/reset-requests/reset-request.entity';
import { ResetRequestRepository } from 'src/domain/entities/reset-requests/reset-request.repository';
import { DrizzleDB, InjectDb } from '../db-connection';
import { resetReqTbl } from '../models/reset-request.model';
import { eq } from 'drizzle-orm';
import { InternalServerErrorException, Provider } from '@nestjs/common';
import { ResetRequestNotFound } from 'src/domain/entities/reset-requests/reset-request.errors';

export class ResetReqDrizzleRepo extends ResetRequestRepository {
  constructor(@InjectDb() private readonly db: DrizzleDB) {
    super();
  }
  async update(entity: ResetRequest) {
    const data = entity.forUpdate();
    try {
      await this.db
        .update(resetReqTbl)
        .set(data)
        .where(eq(resetReqTbl.id, entity.id));
      return entity;
    } catch {
      throw new InternalServerErrorException();
    }
  }
  async insert(entity: ResetRequest) {
    try {
      const data = entity.serialize();
      console.log(data);
      await this.db.insert(resetReqTbl).values(data);
      return entity;
    } catch (e) {
      console.error(e.message);
      throw new InternalServerErrorException();
    }
  }
  async fetchById(id: ResetRequest['id']) {
    try {
      const entity = await this.db
        .select()
        .from(resetReqTbl)
        .where(eq(resetReqTbl.id, id));

      if (!entity) throw new ResetRequestNotFound(id);

      return entity[0];
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

export const ResetReqRepoProvider: Provider<ResetRequestRepository> = {
  provide: ResetRequestRepository,
  useClass: ResetReqDrizzleRepo,
};
