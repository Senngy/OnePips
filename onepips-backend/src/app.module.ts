import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module.js';
import { PermissionsModule } from './modules/permissions/permissions.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { LeadsModule } from './modules/leads/leads.module.js';
import { ApplicationsModule } from './modules/applications/applications.module.js';
import { BookingModule } from './modules/booking/booking.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { EventsModule } from './modules/events/events.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { CommunityModule } from './modules/community/community.module.js';
import { UploadModule } from './modules/upload/upload.module.js';
import { EmailModule } from './modules/email/email.module.js';
import { CronService } from './jobs/cron.service.js';
import databaseConfig from './config/database.config.js';
import jwtConfig from './config/jwt.config.js';
import appConfig from './config/app.config.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { LoggerMiddleware } from './common/middleware/logger.middleware.js';
import { AuthRateLimitMiddleware } from './common/middleware/auth-rate-limit.middleware.js';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware.js';
import { SecurityService } from './common/security.service.js';
import { jsonBodyParserMiddleware } from './common/middleware/json-body-parser.middleware.js';
import { CsrfMiddleware } from './common/middleware/csrf.middleware.js';
import { RedisModule } from './common/redis/redis.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig],
      validate: (config) => {
        if (!process.env.BETTER_AUTH_SECRET) {
          throw new Error('Missing required env: BETTER_AUTH_SECRET');
        }
        if (!process.env.DATABASE_URL) {
          throw new Error('Missing required env: DATABASE_URL');
        }
        if (!process.env.JWT_SECRET) {
          throw new Error('Missing required env: JWT_SECRET');
        }
        return config;
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 20,
      },
    ]),
    RedisModule,
    AuthModule,
    PermissionsModule,
    UsersModule,
    LeadsModule,
    ApplicationsModule,
    BookingModule,
    PaymentsModule,
    EventsModule,
    AnalyticsModule,
    CommunityModule,
    UploadModule,
    EmailModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [
    CronService,
    SecurityService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');

    // Apply JSON body parser middleware globally; middleware itself filters to /api/auth
    consumer.apply(jsonBodyParserMiddleware).forRoutes('*');

    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer
      .apply(CsrfMiddleware)
      .exclude({
        path: 'auth/(.*)',
        method: RequestMethod.ALL,
      })
      .forRoutes('*');

    // Apply auth rate limit middleware globally; middleware itself filters to /api/auth
    consumer.apply(AuthRateLimitMiddleware).forRoutes('*');

  }
}
