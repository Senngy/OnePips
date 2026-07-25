import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { PermissionsGuard } from '../permissions/guards/permissions.guard.js';
import { Permissions } from '../permissions/decorators/permissions.decorator.js';
import { Permission } from '../../../generated/prisma/client.js';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.BOOKINGS_READ)
  async findAll() {
    return this.bookingService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.BOOKINGS_WRITE)
  async create(@Body() body: any) {
    return this.bookingService.create(body);
  }
}
