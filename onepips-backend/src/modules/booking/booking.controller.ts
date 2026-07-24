import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return this.bookingService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: any) {
    return this.bookingService.create(body);
  }
}
