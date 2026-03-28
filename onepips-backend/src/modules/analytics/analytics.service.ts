import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async getOverview() {
    return { totalLeads: 0, totalApplications: 0 };
  }
}
