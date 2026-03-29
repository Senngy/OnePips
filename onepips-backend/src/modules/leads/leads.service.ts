import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { calculateScore, getLeadStatus } from '../../common/utils/scoring.js';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) { }
  
  async findAll() {
    return this.prisma.lead.findMany();
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
}