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
import {
  GoogleDriveModule,
  GoogleDriveConfig,
} from 'nestjs-googledrive-upload';
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
    GoogleDriveModule.register(
      {
        type: 'service_account',
        project_id: 'follo-443918',
        private_key_id: '250141617e1a08f5c52f8c713f189d509c469057',
        private_key:
          '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQWNet+n4gJMOX\n3mgaKDJz/oRf3z6m3idVAniydYbmivVH+DFJnCG4sg+LB20BUs/M2iDFS+ZUH+eA\nq7JfwH+5vFBlJ3rBivYSY5S0wf41YQW8Lb/0PXiVaFwJJqCJkwoMsHo338HS7ZA4\nYLGAFZmADxeJc3oay/sVypNf2zWansaLrP0V1JAEf1+pyO5omS1RnPQRHFB+FsPp\nd23tNwBwzYM9Y2Q8Ix1alIGTqJAmkVv04WE5nOLdrA1pe3Kjp+i4AJm5MetRCnIG\nxs+01QE2BArsMCqG86dnP77gbCIZ2bQeFXWpQVMhV0aTLzggeN3ga+82xCoxaPo9\nuNQHegStAgMBAAECggEAAoHdVN3X//TcgYVrprru4Bo+3L1d0JFNzwlnujRVxZ2m\nUaT0TWx9vGXStDqITHkyAKCwHPjIiv66S6rlS3zuNipiipAHBAI3c8ezTuHnGnph\nLZKDCkaYxT8friccmXAJ+gnRDWEeFkOfQMYrHkYIiXxnJH4qfBA8yvRCKBJoLw1u\nT2cu251ESTuMOq6neutpq6zzuGvEtK/OSuXuR/3XrCABU5tqivTsVxSjfsN3dcWD\nSTTNAMdciOtkPu+kUeY+hIbNht0QHgYdiVsuPDUPkvdZfrH555ME0zeC6vMyUKWV\nnVEtvXpzBFsOTb5XFqBKi/HVa3xEuBDGRv4m7MfIiQKBgQDpS78pkAXz6b8DSkCc\nCf7nnsZ4g1NPZ5Fs6sxWYBNdXZqrNA7RdLX8PWakPULzT5890/97ogmQ66tx61Mz\n9zxDfLY6Tnq8ZpFZXwAskIA03PCzEF4m+jmoW19JOzNP7FQ5sqsxnaRDGt6fSB8h\nghZpuMrAY84IjsPc0bF+G+2xmQKBgQDkn4djEv2z1nfOK7CVVJoigXy1EcXu/uiQ\nOXMfdApj3EpYA3aH9Q8FOvY/juYqOCdOFKZMfoivcHXJD9fj5LuIX8M2MDueEjgw\n2iLbR1AMjH53NIC1ihQ0tiEmdoZZqh22oX6IwPSZ31AOCvrI5/nj1GkkklQHZbXd\nvghY0I5ANQKBgHlH7YsX2mBhBfIZ6di0wZV7z0XbT7YZ61op/ixxKeABx2R1Xba5\n69nDudZsGqAOpoQn78tAA6UZPzmr0sdTIjsbXEiXf+rtj2ZcouSIAn541ZDhU3ED\n6HGDfte9NQG5pFeScLkMcNaJ423+umBbFnfDn3PA7t04Cs6DHLiooDsRAoGAQTTO\n5I8SFSziVsdXQgAzRgwwiWRcU+IYaqo4D4yFOh4mhhvWvshCVHeQrGgRdZE2hKqX\nE9IzIfatYX9HUBR4+Fh30QjIuDjyFdzhfDFGv42CtHUhEKYlRTN9GP9NKl2+w8wj\nztVZ7lkm+BphlNO1DioTIv8pQELeMDR3JP221NECgYEAnVZCeEcJ8GnuaRNl1O/n\nHX4Hdk2/ajC3OxxHLhVObHlWhjmCgn4mU//mYJlzYOkQSU8ZVWFHkqdSU4NjLIfd\nrKW3LkfI5RnrgddUj20K7Vg/ebCbIuebxhyz3IACMLV2H5eBFyLQMhxYa0sgvnzO\nERO4JCMtMdga6SnQnj1zIsY=\n-----END PRIVATE KEY-----\n',
        client_email: 'follo-114@follo-443918.iam.gserviceaccount.com',
        client_id: '112588625568116482345',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url:
          'https://www.googleapis.com/robot/v1/metadata/x509/follo-114%40follo-443918.iam.gserviceaccount.com',
        universe_domain: 'googleapis.com',
      } as GoogleDriveConfig,
      process.env.GOOGLE_DRIVE_FOLDER_ID,
    ),
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
