import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventStateDto } from './DTO/event-state.DTO.js';
import { EventCreateDto } from './DTO/create-event.DTO.js';
import { CreateLeadDto } from '../leads/dto/create-lead.dto.js';
import { EventUpdateDto } from './DTO/update-event.DTO.js';
import { TurnstileGuard } from '../../common/guards/turnstile.guard.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { PermissionsGuard } from '../permissions/guards/permissions.guard.js';
import { Permissions } from '../permissions/decorators/permissions.decorator.js';
import { Permission } from '../../../generated/prisma/client.js';

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

  @Get('state')
  async getEventState(): Promise<EventStateDto>  {
    return this.eventsService.getEventState();
  }

  @Get('archived')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.EVENTS_READ)
  async getArchivedEvents() {
    return this.eventsService.getArchivedEvents();
  }

  @Get(':id/participants')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.EVENTS_READ)
  async getEventParticipants(@Param('id') eventId: string) {
    return this.eventsService.getEventParticipants(eventId);
  }

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.EVENTS_WRITE)
  async create(@Body() body: EventCreateDto) {
    return this.eventsService.create(body);
  }

  @Post(':id/register')
  @UseGuards(TurnstileGuard)
  async register(@Param('id') eventId: string, @Body() dto: CreateLeadDto) {
    return this.eventsService.register(dto, eventId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.EVENTS_WRITE)
  async update(@Param('id') eventId: string, @Body() body: EventUpdateDto) {
    return this.eventsService.update(eventId, body);
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.EVENTS_WRITE)
  async cancelEvent(@Param('id') eventId: string) {
    return this.eventsService.cancelEvent(eventId);
  }

  @Patch(':id/publish')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.EVENTS_WRITE)
  async publishEvent(@Param('id') eventId: string) {
    return this.eventsService.publishEvent(eventId);
  }
}
