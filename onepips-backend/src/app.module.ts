import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { LeadsModule } from './modules/leads/leads.module.js';
import { ApplicationsModule } from './modules/applications/applications.module.js';
import { BookingModule } from './modules/booking/booking.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { EventsModule } from './modules/events/events.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { CronService } from './jobs/cron.service.js';
import databaseConfig from './config/database.config.js';
import jwtConfig from './config/jwt.config.js';
import appConfig from './config/app.config.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { LoggerMiddleware } from './common/middleware/logger.middleware.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig],
    }),
    AuthModule,
    UsersModule,
    LeadsModule,
    ApplicationsModule,
    BookingModule,
    PaymentsModule,
    EventsModule,
    AnalyticsModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [CronService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
