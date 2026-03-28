import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) { }

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

    // 🔥 BONUS : webhook Discord (optionnel)
    // await this.sendToDiscord(lead);

    return lead;
  }

  private calculateScore(dto: CreateLeadDto): number {
    let score = 0;

    // 💰 Budget formation
    if (dto.budgetFormation) {
      if (dto.budgetFormation >= 3000) score += 40;
      else if (dto.budgetFormation >= 1000) score += 20;
    }

    // 💸 Budget trading
    if (dto.budgetTrading) {
      if (dto.budgetTrading >= 1000) score += 30;
      else if (dto.budgetTrading >= 500) score += 15;
    }

    // 📈 Expérience
    if (dto.tradingYears) {
      if (dto.tradingYears >= 5) score += 30;
      else if (dto.tradingYears >= 3) score += 20;
      else if (dto.tradingYears >= 1) score += 10;
    }

    // 🎯 Intérêts (high ticket)
    if (dto.interests?.includes('ACCOMPAGNEMENT')) score += 20;
    if (dto.interests?.includes('ONE_TO_ONE')) score += 25;

    // 📊 Marchés (plus sérieux)
    if (dto.markets?.includes('FUTURES')) score += 20;

    // 🧠 Compte propfirm = bon signal
    if (dto.accountType?.includes('PROPFIRM')) score += 25;

    return score;
  }

  private getStatus(score: number): 'NEW' | 'QUALIFIED' | 'REJECTED' {
    if (score >= 70) return 'QUALIFIED';
    if (score >= 30) return 'NEW';
    return 'REJECTED';
