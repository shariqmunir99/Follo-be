import { resetReqTbl } from './reset-request.model';
import { userTbl } from './user.model';
import { verifyReqTbl } from './verify-request.model';

const dbSchema = {
  users: userTbl,
  resetRequests: resetReqTbl,
  verifyRequests: verifyReqTbl,
};

export default dbSchema;
