import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingService {
  async findAll() {
    return [];
  }

  async create(data: any) {
    return { id: 'dummy-booking-id', ...data };
  }
}
