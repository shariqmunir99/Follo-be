import { Module } from '@nestjs/common';
import { AuthController } from './web/controllers/auth/auth.controller';
import { AppModule } from './infra/di';
import { JwtAuthGuard } from './web/filters/Guards/AuthGuard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './web/filters/Guards/RoleGuard';
import { EventController } from './web/controllers/event/event.controller';
import { UserController } from './web/controllers/user/user.controllers';

@Module({
  imports: [AppModule],
  controllers: [AuthController, EventController, UserController],
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
export class WebModule {}
