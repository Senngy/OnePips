import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { calculateScore } from '../../common/utils/scoring.js';
import { NotificationsService } from '../notifications/notification.service.js';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }

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
}
