import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { TestimonialDto } from './DTO/testimonial.DTO.js'; 

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) { }

  async getTestimonials() {
    return this.prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getResults() {
    return this.prisma.result.findMany({
      orderBy: { createdAt: 'desc' },
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