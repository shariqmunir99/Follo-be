import { eventTbl } from './event.model';
import { favoritedByTbl } from './favorited-by.model';
import { interestedByTbl } from './interested-by.model';
import { resetReqTbl } from './reset-request.model';
import { roleTbl } from './role.model';
import { userTbl } from './user.model';
import { verifyReqTbl } from './verify-request.model';

const dbSchema = {
  users: userTbl,
  resetRequests: resetReqTbl,
  verifyRequests: verifyReqTbl,
  roles: roleTbl,
  events: eventTbl,
  interestedBy: interestedByTbl,
  favoritedBy: favoritedByTbl,
};

export default dbSchema;
