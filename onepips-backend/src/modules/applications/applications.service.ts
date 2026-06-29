import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { CreateDirectApplicationDto } from './dto/create-direct-application.dto.js';
import { calculateScore, getLeadStatus } from '../../common/utils/scoring.js';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.application.findMany({ include: { lead: true } });
  }

  async create(dto: CreateApplicationDto) {
    // 1. Check if lead exists
    const lead = await this.prisma.lead.findUnique({
      where: { id: dto.leadId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${dto.leadId} not found`);
    }

    // 1b. Check if application already exists for this lead
    const existing = await this.prisma.application.findUnique({
      where: { leadId: dto.leadId },
    });

    if (existing) {
      throw new ConflictException('Cette candidature a déjà été soumise. Vous allez être recontacté par notre équipe.');
    }

    // 2. Compute score for the application
    // We map budgetTrading to capitalTrading for scoring consistency
    const appScore = calculateScore({
      ...dto,
      budgetTrading: dto.capitalTrading,
    });

    // 3. Perform Transaction
    return this.prisma.$transaction(async (tx) => {
      // Create Application
      const application = await tx.application.create({
        data: {
          leadId: dto.leadId,
          answers: dto.answers,
          score: appScore,
          status: 'NEW',
          interests: dto.interests || [],
          budgetFormation: dto.budgetFormation,
          capitalTrading: dto.capitalTrading,
        },
      });

      // Update Lead to HOT status since they applied
      await tx.lead.update({
        where: { id: dto.leadId },
        data: {
          status: 'HOT',
        },
      });

      // 4. Send Discord Notification
      /*
      await this.notificationsService.sendToDiscord(`
        Nouvelle candidature mentorat

        Nom: ${lead.name}
        Score: ${application.score}
        Budget formation: ${lead.budgetFormation}€
      `);
      */

      return application;
    });
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.application.update({
      where: { id },
      data: { status },
    });
  }

  async createDirect(dto: CreateDirectApplicationDto) {
    // Exclude cfTurnstileToken from persistence (it's only for validation)
    const { cfTurnstileToken, ...safeDto } = dto;
    
    const score = calculateScore(safeDto);
    const status = getLeadStatus(score);

    return this.prisma.$transaction(async (tx) => {
      const lead = await tx.lead.upsert({
        where: { email: safeDto.email },
        update: {
          name: safeDto.name,
          phone: safeDto.phone,
          source: safeDto.source ?? 'direct',
          interests: safeDto.interests ?? [],
          tradingYears: safeDto.tradingYears,
          budgetFormation: safeDto.budgetFormation,
          budgetTrading: safeDto.budgetTrading,
          markets: safeDto.markets ?? [],
          accountType: safeDto.accountType ?? [],
          score,
          status,
        },
        create: {
          name: safeDto.name,
          email: safeDto.email,
          phone: safeDto.phone,
          source: safeDto.source ?? 'direct',
          interests: safeDto.interests ?? [],
          tradingYears: safeDto.tradingYears,
          budgetFormation: safeDto.budgetFormation,
          budgetTrading: safeDto.budgetTrading,
          markets: safeDto.markets ?? [],
          accountType: safeDto.accountType ?? [],
          score,
          status,
        },
      });

      const application = await tx.application.create({
        data: {
          leadId: lead.id,
          answers: {
            name: safeDto.name,
            email: safeDto.email,
            phone: safeDto.phone,
            tradingYears: safeDto.tradingYears,
            interests: safeDto.interests,
            budgetFormation: safeDto.budgetFormation,
            budgetTrading: safeDto.budgetTrading,
            markets: safeDto.markets,
            accountType: safeDto.accountType,
          },
          score,
          status: 'NEW',
          interests: safeDto.interests ?? [],
          budgetFormation: safeDto.budgetFormation,
          capitalTrading: safeDto.budgetTrading,
        },
      });

      return { lead, application };
    });
  }
}
