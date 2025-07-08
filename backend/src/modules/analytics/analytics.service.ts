import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from '../../database/entities/deal.entity';
import { Customer } from '../../database/entities/customer.entity';
import { Interaction } from '../../database/entities/interaction.entity';
import { DealStage } from '@insightflow/shared';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>,
  ) {}

  async getDashboardData(): Promise<{
    kpis: {
      revenue: number;
      revenueChange: number;
      customers: number;
      customersChange: number;
      activeDeals: number;
      dealsChange: number;
      conversionRate: number;
      conversionChange: number;
    };
    revenueChart: Array<{ month: string; revenue: number }>;
    pipelineChart: Array<{ name: string; value: number }>;
    recentActivities: Array<{
      id: string;
      type: string;
      description: string;
      createdAt: Date;
    }>;
  }> {
    // Calculate KPIs
    const totalRevenue = await this.calculateTotalRevenue();
    const totalCustomers = await this.customerRepository.count();
    const activeDeals = await this.dealRepository.count({
      where: { stage: DealStage.QUALIFIED },
    });

    // Mock change percentages for now
    const kpis = {
      revenue: totalRevenue,
      revenueChange: 12.5,
      customers: totalCustomers,
      customersChange: 8.3,
      activeDeals,
      dealsChange: -2.1,
      conversionRate: 23.4,
      conversionChange: 5.2,
    };

    // Generate revenue chart data (last 12 months)
    const revenueChart = await this.getRevenueChartData();

    // Generate pipeline chart data
    const pipelineChart = await this.getPipelineChartData();

    // Get recent activities (mock for now)
    const recentActivities = [
      {
        id: '1',
        type: 'customer_created',
        description: 'New customer John Doe was added',
        createdAt: new Date(),
      },
      {
        id: '2',
        type: 'deal_updated',
        description: 'Deal "Enterprise Sales" moved to Negotiation',
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: '3',
        type: 'customer_updated',
        description: 'Customer score updated for Acme Corp',
        createdAt: new Date(Date.now() - 7200000),
      },
    ];

    return {
      kpis,
      revenueChart,
      pipelineChart,
      recentActivities,
    };
  }

  private async calculateTotalRevenue(): Promise<number> {
    const result = await this.dealRepository
      .createQueryBuilder('deal')
      .select('SUM(deal.value)', 'total')
      .where('deal.stage = :stage', { stage: DealStage.CLOSED_WON })
      .getRawOne();

    return Number(result.total) || 0;
  }

  private async getRevenueChartData(): Promise<Array<{ month: string; revenue: number }>> {
    // Mock data for now - in production, you'd query actual data
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return months.map((month, index) => ({
      month,
      revenue: Math.floor(Math.random() * 100000) + 50000,
    }));
  }

  private async getPipelineChartData(): Promise<Array<{ name: string; value: number }>> {
    const stages = Object.values(DealStage);
    const data: Array<{name: string; value: number}> = [];

    for (const stage of stages) {
      const count = await this.dealRepository.count({ where: { stage } });
      data.push({
        name: stage.replace('_', ' '),
        value: count,
      });
    }

    return data;
  }
}