import { Module } from '@nestjs/common';
import { AuthController } from './web/controllers/auth/auth.controller';
import { AuthModule } from './infra/di';
import { JwtAuthGuard } from './web/filters/Guards/AuthGuard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './web/filters/Guards/RoleGuard';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
