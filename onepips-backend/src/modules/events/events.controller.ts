import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventStateDto } from './DTO/event-state.DTO.js';
import { EventCreateDto } from './DTO/create-event.DTO.js';
import { CreateLeadDto } from '../leads/dto/create-lead.dto.js';
import { EventUpdateDto } from './DTO/update-event.DTO.js';
import { TurnstileGuard } from '../../common/guards/turnstile.guard.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get('upcoming')
  async getUpcomingEvents() {
    return this.eventsService.getUpcomingEvents();
  }

  @Get('state') // endpoint : GET /events/state
  async getEventState(): Promise<EventStateDto>  {
    return this.eventsService.getEventState();
  }

  @Get(':id/participants')
  async getEventParticipants(@Param('id') eventId: string) {
    return this.eventsService.getEventParticipants(eventId);
  }

  @Get('archived')
  async getArchivedEvents() {
    return this.eventsService.getArchivedEvents();
  }

  @Post()
  async create(@Body() body: EventCreateDto) {
    return this.eventsService.create(body);
  }

  @Post(':id/register')
  @UseGuards(TurnstileGuard)
  async register(@Param('id') eventId: string, @Body() dto: CreateLeadDto) {
    return this.eventsService.register(dto, eventId);
  }

  @Patch(':id')
  async update(@Param('id') eventId: string, @Body() body: EventUpdateDto) {
    return this.eventsService.update(eventId, body);
  }

  @Patch(':id/cancel')
  async cancelEvent(@Param('id') eventId: string) {
    return this.eventsService.cancelEvent(eventId);
  }

  @Patch(':id/publish')
  async publishEvent(@Param('id') eventId: string) {
    return this.eventsService.publishEvent(eventId);
  }


}
