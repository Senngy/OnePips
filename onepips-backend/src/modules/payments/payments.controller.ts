import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: any) {
    return this.paymentsService.create(body);
  }
}
