import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  async findAll() {
    return this.applicationsService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.applicationsService.create(body);
  }
}
