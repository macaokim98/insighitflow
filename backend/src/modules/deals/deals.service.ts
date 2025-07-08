import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from '../../database/entities/deal.entity';
import { DealStage } from '@insightflow/shared';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
  ) {}

  async findAll(): Promise<Deal[]> {
    return this.dealRepository.find({
      relations: ['customer', 'assignedUser'],
    });
  }

  async getDealStats(): Promise<{
    total: number;
    totalValue: number;
    byStage: Record<DealStage, number>;
    averageValue: number;
  }> {
    const deals = await this.dealRepository.find();
    const total = deals.length;
    const totalValue = deals.reduce((sum, deal) => sum + Number(deal.value), 0);
    const averageValue = total > 0 ? totalValue / total : 0;

    const byStage = deals.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
      return acc;
    }, {} as Record<DealStage, number>);

    return {
      total,
      totalValue,
      byStage,
      averageValue,
    };
  }
}