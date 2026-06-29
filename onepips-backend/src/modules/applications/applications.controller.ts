import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { CreateDirectApplicationDto } from './dto/create-direct-application.dto.js';
import { ApplicationStatus } from '../../../prisma/index.js';
import { TurnstileGuard } from '../../common/guards/turnstile.guard.js';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  async findAll() {
    return this.applicationsService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(dto);
  }

  @Post('direct')
  @UseGuards(TurnstileGuard)
  async createDirect(@Body() dto: CreateDirectApplicationDto) {
    return this.applicationsService.createDirect(dto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
  ) {
    return this.applicationsService.updateStatus(id, status);
  }
}
