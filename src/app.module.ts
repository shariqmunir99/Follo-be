import { Module } from '@nestjs/common';
import { AuthController } from './web/controllers/auth/auth.controller';
import { AuthWorkflows } from './app/workflows/auth-workflows';
import { AuthModule } from './infra/di';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
