import { Module } from '@nestjs/common';
import { AuthController } from './web/controllers/auth/auth.controller';
import { AuthModule } from './infra/di';
import { JwtAuthGuard } from './web/filters/Guards/AuthGuard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
