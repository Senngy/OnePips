import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { EventStateDto } from './DTO/event-state.DTO.js';
import { EventCreateDto } from './DTO/create-event.DTO.js';


@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }
  async findAll() {
    return this.prisma.event.findMany({
      orderBy: {
        startsAt: 'asc'
      }
    });
  }

  async create(dto: EventCreateDto) {
    return this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        startsAt: dto.startsAt,
        isPublished: dto.isPublished ?? false,
        isCanceled: dto.isCanceled ?? false,
      }
    });
  }

  async getNextEvent(now: Date = new Date()) {
    return this.prisma.event.findFirst({
      where: {
        isPublished: true,
        isCanceled: false,
        startsAt: {
          gte: now
        }
      },
      orderBy: {
        startsAt: 'asc'
      }
    })
  }

  async getEventState(): Promise<EventStateDto> {
    const nextEvent = await this.getNextEvent();
    return {
      hasEvent: !!nextEvent, // true if there's an upcoming event
      nextEvent, // details of the next event or null if none
    };
  }
}
