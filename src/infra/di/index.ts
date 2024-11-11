import { Module } from '@nestjs/common';
import { AuthWorkflows } from 'src/app/workflows/auth-workflows';
import { DbModule } from '../db/db.module';
import { HashingServiceProvider } from '../../app/services/auth-services/pwHasher.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/app/services/auth-services/jwt-strategy.service';
import { JwtAuthGuard } from 'src/web/filters/Guards/AuthGuard';
import { EmailServiceProvider } from 'src/app/services/auth-services/email.service';

const BASE_PROVIDERS = [HashingServiceProvider, EmailServiceProvider]; //TODO: Add JWTService and EmailService later.

@Module({
  providers: BASE_PROVIDERS,
  exports: BASE_PROVIDERS,
})
export class BaseDiModule {}

const WORKFLOWS = [AuthWorkflows];
const JWT = [JwtStrategy, JwtAuthGuard];

@Module({
  imports: [
    PassportModule,
    DbModule,
    BaseDiModule,
    JwtModule.register({
      secret: process.env.TOKEN_SECRET, // This is your secret key to sign the token (keep it safe!)
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION_SECONDS }, // Tokens will expire after 60 seconds
    }),
  ],
  providers: [...WORKFLOWS, ...JWT],
  exports: [...WORKFLOWS, ...JWT],
})
export class AuthModule {}
