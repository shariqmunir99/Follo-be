import { InterestedBy, SerializedInterestedBy } from './interested-by.entity';

export abstract class InterestedByRepository {
  abstract insert(entity: InterestedBy);
  abstract delete(id: string);
  abstract fetchByEventId(id: string);
  abstract fetchByUserId(id: string): Promise<SerializedInterestedBy[]>;
}
