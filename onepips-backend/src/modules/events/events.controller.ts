import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventStateDto } from './DTO/event-state.DTO.js';
import { EventCreateDto } from './DTO/create-event.DTO.js';
import { CreateLeadDto } from '../leads/dto/create-lead.dto.js';

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

  @Post(':id/register')
  async register(@Param('id') eventId: string, @Body() dto: CreateLeadDto) {
    return this.eventsService.register(dto, eventId);
  }
}
