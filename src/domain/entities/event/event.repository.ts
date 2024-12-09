import { Event } from './event.entity';

export abstract class EventRepository {
  abstract update(entity: Event);
  abstract insert(entity: Event);
  abstract delete(id: string);
  abstract fetchById(id: Event['id'] | string): Promise<Event>;
  abstract fetchByOrganizerId(orgId: string);
}
