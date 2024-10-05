import { Module } from '@nestjs/common';
import { AuthWorkflows } from 'src/app/workflows/auth-workflows';
import { DbModule } from '../db/db-module';
import { HashingServiceProvider } from '../pwHasher';

const BASE_PROVIDERS = [HashingServiceProvider]; //TODO: Add JWTService and EmailService later.

@Module({
  providers: BASE_PROVIDERS,
  exports: BASE_PROVIDERS,
})
export class BaseDiModule {}

const WORKFLOWS = [AuthWorkflows];

@Module({
  imports: [DbModule, BaseDiModule],
  providers: WORKFLOWS,
  exports: WORKFLOWS,
})
export class AuthModule {}
