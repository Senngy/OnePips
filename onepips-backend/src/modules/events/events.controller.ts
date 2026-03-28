import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.eventsService.create(body);
  }
}
