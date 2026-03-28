import { Controller, Get, Post, Body } from '@nestjs/common';
import { BookingService } from './booking.service.js';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async findAll() {
    return this.bookingService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.bookingService.create(body);
  }
}
