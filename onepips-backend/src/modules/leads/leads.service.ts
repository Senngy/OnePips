import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { calculateScore, getLeadStatus } from '../../common/utils/scoring.js';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) { }
  
  async findAll(query?: { status?: string; minScore?: number; search?: string }) {
    const where: any = {};

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.minScore) {
      where.score = { gte: Number(query.minScore) };
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.lead.findMany({
      where,
      orderBy: {
        score: 'desc',
      },
    });
  }

  async create(dto: CreateLeadDto) {
    const score = calculateScore(dto);
    const status = getLeadStatus(score);

    const lead = await this.prisma.lead.upsert({
      where: { email: dto.email },
      update: {
        ...dto,
        score,
        status,
      },
      create: {
        ...dto,
        score,
        status,
      },
    });
    return lead;
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.lead.update({
      where: { id },
      data: { status },
    });
  }
}