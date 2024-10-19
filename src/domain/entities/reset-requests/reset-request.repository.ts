import { ResetRequest } from './reset-request.entity';

export abstract class ResetRequestRepository {
  abstract update(entity: ResetRequest);
  abstract insert(entity: ResetRequest);
  abstract fetchById(id: ResetRequest['id']);
}