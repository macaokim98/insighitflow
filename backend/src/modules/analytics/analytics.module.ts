import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Deal } from '../../database/entities/deal.entity';
import { Customer } from '../../database/entities/customer.entity';
import { Interaction } from '../../database/entities/interaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deal, Customer, Interaction])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}