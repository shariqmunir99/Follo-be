import { eventTbl } from './event.model';
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
};

export default dbSchema;
