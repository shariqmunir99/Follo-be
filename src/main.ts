import { NestFactory } from '@nestjs/core';
import { WebModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(WebModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If using cookies or authorization headers
    allowedHeaders: 'Authorization, Content-Type', // Allow Authorization header
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3001);
}
bootstrap();
