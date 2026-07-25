import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { PermissionsGuard } from '../permissions/guards/permissions.guard.js';
import { Permissions } from '../permissions/decorators/permissions.decorator.js';
import { Permission } from '../../../generated/prisma/client.js';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.LEADS_READ, Permission.APPLICATIONS_READ, Permission.PAYMENTS_READ)
  async getOverview() {
    return this.analyticsService.getOverview();
  }
}
