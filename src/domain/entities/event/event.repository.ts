import { Event } from './event.entity';

export abstract class EventRepository {
  abstract update(entity: Event);
  abstract insert(entity: Event);
  abstract delete(id: string);
  abstract fetchById(id: Event['id'] | string): Promise<Event>;
  abstract fetchByOrganizerId(orgId: string);
  abstract fetchPaginatedByOrgId(orgIds: any[], offset: number, limit: number);
  abstract fetchPaginatedEventsByLocation(
    location: string,
    offset: number,
    limit: number,
    except: boolean, // If true, then the function fetches events whose location does not match the location
  );
  abstract fetchPaginatedEventsExceptLocation(
    location: string,
    offset: number,
    limit: number,
    excludeOrgIds: string[],
    except: boolean,
  );
}
