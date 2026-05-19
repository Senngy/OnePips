import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CommunityService } from './community.service.js';
import { ResultDto } from './DTO/result.DTO.js';


@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('testimonials')
  async getTestimonials() {
    return this.communityService.getTestimonials();
  }

  @Post('testimonials')
  async create(@Body() body: any) {
    return this.communityService.createTestimonial(body);
  }

  @Patch('testimonials/:id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.communityService.updateTestimonial(id, body);
  }

  @Delete('testimonials/:id')
  async delete(@Param('id') id: string) {
    return this.communityService.deleteTestimonial(id);
  }

  @Get('stats')
  async getStats() {
    return this.communityService.getStats();
  }

  @Get('results')
  async getResults() {
    return this.communityService.getResults();
  }

  @Post('results')
  async createResult(@Body() body: ResultDto) {
    return this.communityService.createResult(body);
  }

  @Patch('results/:id')
  async updateResult(@Param('id') id: string, @Body() body: Partial<ResultDto>) {
    return this.communityService.updateResult(id, body);
  }

  @Delete('results/:id')
  async deleteResult(@Param('id') id: string) {
    return this.communityService.deleteResult(id);
  }
}