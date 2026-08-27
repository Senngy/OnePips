import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException, ConsoleLogger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import helmet from 'helmet';
import type { ValidationError } from 'class-validator';
import { helmetOptions } from './common/helmet.config.js';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';

function exceptionFactory(errors: ValidationError[]) {
  const fields: Record<string, string[]> = {};
  for (const error of errors) {
    const messages = error.constraints ? Object.values(error.constraints) : [];
    if (messages.length > 0) {
      fields[error.property] = messages;
    }
  }
  return new BadRequestException({
    code: 'VALIDATION_ERROR',
    message: 'Les données envoyées sont invalides.',
    details: { fields },
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false, // Requis par Better Auth
    logger: new ConsoleLogger({}), // Utilisation de ConsoleLogger pour la compatibilité avec NestJS 10
  });

  app.use(helmet(helmetOptions(process.env.NODE_ENV || 'development')));

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory,
    }),
  );
  const FRONT_URL = process.env.FRONT_URL || 'http://localhost:3000';

  app.enableCors({
    origin: FRONT_URL,
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
