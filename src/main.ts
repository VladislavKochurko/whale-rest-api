import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from './app/core/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const logger = app.get(Logger);
  app.useGlobalFilters(new GlobalExceptionsFilter(logger));
  app.useLogger(logger);
  await app.listen(3000);
}

bootstrap();
