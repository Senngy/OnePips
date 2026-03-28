import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.paymentsService.create(body);
  }
}
