import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CommunityService } from './community.service.js';


@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get()
  async getTestimonials() {
    return this.communityService.getTestimonials();
  }

  @Post()
  async create(@Body() body: any) {
    return this.communityService.createTestimonial(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.communityService.updateTestimonial(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.communityService.deleteTestimonial(id);
  }
}