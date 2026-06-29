import { Controller, Get, Post, Body, Query, Patch, Param, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { LeadStatus } from '../../../prisma/index.js';
import { TurnstileGuard } from '../../common/guards/turnstile.guard.js';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query('status') status?: string,
    @Query('score') score?: number,
    @Query('search') search?: string,
    @Query('minScore') minScore?: number,
    @Query('maxScore') maxScore?: number,
  ) {
    return this.leadsService.findAll({
      page: Number(page),
      limit: Number(limit),
      search,
      status,
      score: score ? Number(score) : undefined,
      minScore: minScore ? Number(minScore) : undefined,
      maxScore: maxScore ? Number(maxScore) : undefined,
    });
  }

  @Post()
  @UseGuards(TurnstileGuard)
  async create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: LeadStatus,
  ) {
    return this.leadsService.updateStatus(id, status);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    return this.leadsService.update(id, dto);
  }

  @Delete('bulk')
  async deleteBulk(@Body('ids') ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('At least one ID is required');
    }
    return this.leadsService.deleteBulk(ids);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.leadsService.delete(id);
  }
}
