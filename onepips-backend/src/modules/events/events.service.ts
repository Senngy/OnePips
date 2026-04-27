import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { EventStateDto } from './DTO/event-state.DTO.js';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }
  async findAll() {
    return [];
  }

  async create(data: any) {
    return { id: 'dummy-event-id', ...data };
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

  async getEventState() {
    const nextEvent = await this.getNextEvent();
    return {
      hasEvent: !!nextEvent, // true if there's an upcoming event
      nextEvent, // details of the next event or null if none
    };
  }
}
