import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventStateDto } from './DTO/event-state.DTO.js';
import { EventCreateDto } from './DTO/create-event.DTO.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get('state') // endpoint : GET /events/state
  async getEventState(): Promise<EventStateDto>  {
    return this.eventsService.getEventState();
  }

  @Post()
  async create(@Body() body: EventCreateDto) {
    return this.eventsService.create(body);
  }
}
