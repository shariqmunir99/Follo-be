import { DrizzleDB, InjectDb } from '../db-connection';
import { eq } from 'drizzle-orm';
import { InternalServerErrorException, Provider } from '@nestjs/common';
import { VerifyRequestRepository } from 'src/domain/entities/verify-requests/verify-request.repository';
import { VerifyRequest } from 'src/domain/entities/verify-requests/verify-request.entity';
import { VerifyRequestNotFound } from 'src/domain/entities/verify-requests/verify-request.errors';
import { verifyReqTbl } from '../models/verify-request.model';

export class VerifyReqDrizzleRepo extends VerifyRequestRepository {
  constructor(@InjectDb() private readonly db: DrizzleDB) {
    super();
  }
  async update(entity: VerifyRequest) {
    const data = entity.forUpdate();
    try {
      await this.db
        .update(verifyReqTbl)
        .set(data)
        .where(eq(verifyReqTbl.id, entity.id));
      return entity;
    } catch {
      throw new InternalServerErrorException();
    }
  }
  async insert(entity: VerifyRequest) {
    try {
      const data = entity.serialize();
      await this.db.insert(verifyReqTbl).values(data);
      return entity;
    } catch {
      throw new InternalServerErrorException();
    }
  }
  async fetchById(id: VerifyRequest['id']) {
    try {
      const entity = await this.db
        .select()
        .from(verifyReqTbl)
        .where(eq(verifyReqTbl.id, id));

      if (!entity) throw new VerifyRequestNotFound(id);

      return entity[0];
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

export const VerifyReqRepoProvider: Provider<VerifyRequestRepository> = {
  provide: VerifyRequestRepository,
  useClass: VerifyReqDrizzleRepo,
};