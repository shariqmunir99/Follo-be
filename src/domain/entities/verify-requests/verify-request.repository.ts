import { VerifyRequest } from './verify-request.entity';

export abstract class VerifyRequestRepository {
  abstract update(entity: VerifyRequest);
  abstract insert(entity: VerifyRequest);
  abstract fetchById(id: VerifyRequest['id']);
}
