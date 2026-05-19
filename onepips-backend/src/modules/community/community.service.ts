import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { TestimonialDto } from './DTO/testimonial.DTO.js';
import { ResultDto } from './DTO/result.DTO.js'; 

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) { }

  async getTestimonials() {
    return this.prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    return this.prisma.communityStat.findMany({
      orderBy: { label: 'asc' },
    });
  }

  async getResults() {
    return this.prisma.result.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createResult(data: ResultDto) {
    return this.prisma.result.create({
      data: {
        title: data.title,
        image: data.image,
        gain: data.gain,
        pair: data.pair,
        description: data.description,
        date: new Date(data.date),
        isVisible: data.isVisible ?? true,
      },
    });
  }

  async updateResult(id: string, data: Partial<ResultDto>) {
    return this.prisma.result.update({
      where: { id: id },
      data: {
        title: data.title,
        image: data.image,
        gain: data.gain,
        pair: data.pair,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
        isVisible: data.isVisible,
      },
    });
  }

  async deleteResult(id: string) {
    return this.prisma.result.delete({
      where: { id: id },
    });
  }

  async createTestimonial(data: TestimonialDto) {
    return this.prisma.testimonial.create({
      data: {
        name: data.name,
        role: data.role ,
        rating: data.rating ?? 0,
        content: data.content ?? '',
        isVisible: data.isVisible,
      },
    });
  }

  async updateTestimonial(id: string, data: Partial<TestimonialDto>) {
    return this.prisma.testimonial.update({
      where: { id: id },
      data: {
        name: data.name,
        role: data.role,
        rating: data.rating ?? 0,
        content: data.content ?? '',
        isVisible: data.isVisible,
      },
    });
  }

  deleteTestimonial(id: string) {
    return this.prisma.testimonial.delete({
      where: { id: id },
    });
  }
}