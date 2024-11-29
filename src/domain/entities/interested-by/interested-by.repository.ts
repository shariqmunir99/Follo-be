import { Event } from '../event/event.entity';
import { InterestedBy, SerializedInterestedBy } from './interested-by.entity';

export abstract class InterestedByRepository {
  abstract insert(entity: InterestedBy);
  abstract delete(userId: string, eventId: string);
  abstract deleteByUserId(userId: string);
  abstract deleteByEventId(eventId: string);
  abstract fetchByEventId(id: string);
  abstract fetchByUserId(id: string): Promise<Event[]>;
  abstract getRecentInteractionsCount(eventid: string);
}
