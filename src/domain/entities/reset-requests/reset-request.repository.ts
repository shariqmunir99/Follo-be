import { ResetRequest } from './reset-request.entity';

export abstract class ResetRequestRepository {
  abstract update(entity: ResetRequest);
  abstract insert(entity: ResetRequest);
  abstract deleteByUserId(userId: string);
  abstract fetchById(id: ResetRequest['id'] | string): Promise<ResetRequest>;
}
