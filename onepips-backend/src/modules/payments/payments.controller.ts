import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { PermissionsGuard } from '../permissions/guards/permissions.guard.js';
import { Permissions } from '../permissions/decorators/permissions.decorator.js';
import { Permission } from '../../../generated/prisma/client.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.PAYMENTS_READ)
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.PAYMENTS_WRITE)
  async create(@Body() body: any) {
    return this.paymentsService.create(body);
  }
}
