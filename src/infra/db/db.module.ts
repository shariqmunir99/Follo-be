import { Global, Module } from '@nestjs/common';
import { drizzleDbProvider } from './drizzle/db-connection';
import { UserRepoProvider } from './drizzle/repos/user.drizzle-repo';
import { ResetReqRepoProvider } from './drizzle/repos/reset-request.drizzle-repo';
import { VerifyReqRepoProvider } from './drizzle/repos/verify-request.drizzle-repo';
import { RoleRepoProvider } from './drizzle/repos/role.drizzle-repo';
import { EventRepoProvider } from './drizzle/repos/event.drizzle-repo';
import { InterestedByRepoProvider } from './drizzle/repos/interested-by.drizzle-repo';
import { FavoritedByRepoProvider } from './drizzle/repos/favorited-by.drizzle-repo';

const REPOS = [
  drizzleDbProvider,
  UserRepoProvider,
  ResetReqRepoProvider,
  VerifyReqRepoProvider,
  RoleRepoProvider,
  EventRepoProvider,
  InterestedByRepoProvider,
  FavoritedByRepoProvider,
];

@Global()
@Module({
  providers: REPOS,
  exports: REPOS,
})
export class DbModule {}
