import { VerifyRequest } from './verify-request.entity';

export abstract class VerifyRequestRepository {
  abstract update(entity: VerifyRequest);
  abstract insert(entity: VerifyRequest);
  abstract deleteByUserId(userId: string);
  abstract fetchById(id: VerifyRequest['id'] | string): Promise<VerifyRequest>;
}
