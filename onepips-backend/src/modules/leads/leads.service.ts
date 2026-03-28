import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) { }
  
  async findAll() {
    return this.prisma.lead.findMany();
  }
  async create(dto: CreateLeadDto) {
    const score = this.calculateScore(dto);
    const status = this.getStatus(score);

    const lead = await this.prisma.lead.create({
      data: {
        ...dto,
        score,
        status,
      },
    });
    // BONUS : webhook Discord (optionnel)
    // await this.sendToDiscord(lead);
    return lead;
  }
  private calculateScore(dto: CreateLeadDto): number {
    let score = 0;

    // Budget formation
    if (dto.budgetFormation) {
      if (dto.budgetFormation >= 5000) score += 20;
      else if (dto.budgetFormation >= 1000) score += 15;
      else if (dto.budgetFormation >= 150) score += 10;
      else if (dto.budgetFormation >= 90) score += 5;

    }

    // Budget trading
    if (dto.budgetTrading) {
      if (dto.budgetTrading >= 1000) score += 20;
      else if (dto.budgetTrading >= 500) score += 10;
    }

    // Expérience
    if (dto.tradingYears) {
      if (dto.tradingYears >= 5) score += 20;
      else if (dto.tradingYears >= 3) score += 15;
      else if (dto.tradingYears >= 1) score += 10;
    }

    // Intérêts (high ticket)
    if (dto.interests?.includes('PRIVATE_COACHING')) score += 10;
    if (dto.interests?.includes('ONE_TO_ONE')) score += 5;
    if (dto.interests?.includes('LIVES_SUBSCRIPTION')) score += 3;
    if (dto.interests?.includes('SIGNALS')) score += 2;


    // Marchés (plus sérieux)np
    if (dto.markets?.includes('FUTURES')) score += 7;
    if (dto.markets?.includes('CFD')) score += 3;

    // Compte propfirm = bon signal
    if (dto.accountType?.includes('PROPFIRM')) score += 5;
    if (dto.accountType?.includes('PERSONAL')) score += 3;
    if (dto.accountType?.includes('DEMO')) score += 2;

    return score;
  }
  private getStatus(score: number): 'HOT' | 'MID' | 'COLD' { 
    if (score >= 70) return 'HOT';
    if (score >= 40) return 'MID';
    return 'COLD';
  }


}