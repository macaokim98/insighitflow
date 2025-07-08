import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('deals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @ApiOperation({ summary: 'Get all deals' })
  @ApiResponse({ status: 200, description: 'Deals retrieved successfully' })
  @Get()
  async findAll() {
    return this.dealsService.findAll();
  }

  @ApiOperation({ summary: 'Get deal statistics' })
  @ApiResponse({ status: 200, description: 'Deal statistics retrieved successfully' })
  @Get('stats')
  async getStats() {
    return this.dealsService.getDealStats();
  }
}