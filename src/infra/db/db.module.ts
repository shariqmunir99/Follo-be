import { Global, Module } from '@nestjs/common';
import { drizzleDbProvider } from './drizzle/db-connection';
import { UserRepoProvider } from './drizzle/repos/user.drizzle-repo';
import { ResetReqRepoProvider } from './drizzle/repos/reset-request.drizzle-repo';
import { VerifyReqRepoProvider } from './drizzle/repos/verify-request.drizzle-repo';

const REPOS = [
  drizzleDbProvider,
  UserRepoProvider,
  ResetReqRepoProvider,
  VerifyReqRepoProvider,
];

@Global()
@Module({
  providers: REPOS,
  exports: REPOS,
})
export class DbModule {}
