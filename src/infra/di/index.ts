import { Global, Module } from '@nestjs/common';
import { AuthWorkflows } from 'src/app/workflows/auth.workflows';
import { DbModule } from '../db/db.module';
import { HashingServiceProvider } from '../../app/services/auth-services/pwHasher.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/app/services/auth-services/jwt-strategy.service';
import { JwtAuthGuard } from 'src/web/filters/Guards/AuthGuard';
import { EmailServiceProvider } from 'src/app/services/auth-services/email.service';
import { AuthDomainService } from 'src/domain/services/auth.domain-service';
import { EventWorkflows } from 'src/app/workflows/event.workflow';
import { UserDomainService } from 'src/domain/services/user.domain-service';
import { UserWorkflows } from 'src/app/workflows/user.workflow';
import { EventDomainService } from 'src/domain/services/event.domain-service';

const BASE_PROVIDERS = [HashingServiceProvider, EmailServiceProvider];

@Module({
  providers: BASE_PROVIDERS,
  exports: BASE_PROVIDERS,
})
export class BaseDiModule {}

const WORKFLOWS = [AuthWorkflows, EventWorkflows, UserWorkflows];
const JWT = [JwtStrategy, JwtAuthGuard];

const DOMAIN_SERVICES = [
  AuthDomainService,
  UserDomainService,
  EventDomainService,
];
@Global()
@Module({
  imports: [DbModule, BaseDiModule],
  providers: DOMAIN_SERVICES,
  exports: DOMAIN_SERVICES,
})
class DomainServicesModule {}

@Global()
@Module({
  imports: [
    PassportModule,
    DbModule,
    BaseDiModule,
    DomainServicesModule,
    JwtModule.register({
      secret: process.env.TOKEN_SECRET, // This is your secret key to sign the token (keep it safe!)
      signOptions: { expiresIn: Number(process.env.TOKEN_EXPIRATION_SECONDS) },
    }),
  ],
  providers: [...WORKFLOWS, ...JWT],
  exports: [...WORKFLOWS, ...JWT],
})
export class AppModule {}
