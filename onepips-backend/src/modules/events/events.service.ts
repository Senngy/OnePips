import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  async findAll() {
    return [];
  }

  async create(data: any) {
    return { id: 'dummy-event-id', ...data };
  }
}
