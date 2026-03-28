import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async findAll() {
    return [];
  }

  async create(data: any) {
    return { id: 'dummy-payment-id', ...data };
  }
}
