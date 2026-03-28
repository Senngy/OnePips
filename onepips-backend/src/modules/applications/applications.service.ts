import { Injectable } from '@nestjs/common';

@Injectable()
export class ApplicationsService {
  async findAll() {
    return [];
  }

  async create(data: any) {
    return { id: 'dummy-app-id', ...data };
  }
}
