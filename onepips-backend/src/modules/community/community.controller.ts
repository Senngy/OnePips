import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service.js';
import { ResultDto } from './DTO/result.DTO.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { PermissionsGuard } from '../permissions/guards/permissions.guard.js';
import { Permissions } from '../permissions/decorators/permissions.decorator.js';
import { Permission } from '../../../generated/prisma/client.js';

@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('testimonials')
  async getTestimonials() {
    return this.communityService.getTestimonials();
  }

  @Post('testimonials')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.COMMUNITY_WRITE)
  async create(@Body() body: any) {
    return this.communityService.createTestimonial(body);
  }

  @Patch('testimonials/:id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.COMMUNITY_WRITE)
  async update(@Param('id') id: string, @Body() body: any) {
    return this.communityService.updateTestimonial(id, body);
  }

  @Delete('testimonials/:id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.COMMUNITY_WRITE)
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
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.COMMUNITY_WRITE)
  async createResult(@Body() body: ResultDto) {
    return this.communityService.createResult(body);
  }

  @Patch('results/:id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.COMMUNITY_WRITE)
  async updateResult(
    @Param('id') id: string,
    @Body() body: Partial<ResultDto>,
  ) {
    return this.communityService.updateResult(id, body);
  }

  @Delete('results/:id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.COMMUNITY_WRITE)
  async deleteResult(@Param('id') id: string) {
    return this.communityService.deleteResult(id);
  }
}
