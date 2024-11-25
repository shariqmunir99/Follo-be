import { DrizzleDB, InjectDb } from '../db-connection';
import { eq } from 'drizzle-orm';
import { InternalServerErrorException, Provider } from '@nestjs/common';
import { VerifyRequestRepository } from 'src/domain/entities/verify-requests/verify-request.repository';
import { VerifyRequest } from 'src/domain/entities/verify-requests/verify-request.entity';
import { InvalidVerifyRequest } from 'src/domain/entities/verify-requests/verify-request.errors';
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

  async deleteByUserId(userId: string) {
    try {
      await this.db.delete(verifyReqTbl).where(eq(verifyReqTbl.userId, userId));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new InternalServerErrorException(userId);
    }
  }

  async fetchById(id: VerifyRequest['id']): Promise<VerifyRequest> {
    try {
      const entity = await this.db
        .select()
        .from(verifyReqTbl)
        .where(eq(verifyReqTbl.id, id));

      if (!entity) throw new InvalidVerifyRequest(id);

      return VerifyRequest.fromSerialized(entity[0]);
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

export const VerifyReqRepoProvider: Provider<VerifyRequestRepository> = {
  provide: VerifyRequestRepository,
  useClass: VerifyReqDrizzleRepo,
};
