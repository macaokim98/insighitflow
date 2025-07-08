import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerFilterDto } from './dto/customer-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Customer, PaginatedResponse } from '@insightflow/shared';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 409, description: 'Customer with email already exists' })
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @ApiOperation({ summary: 'Get all customers with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  @Get()
  async findAll(@Query() filter: CustomerFilterDto): Promise<PaginatedResponse<Customer>> {
    return this.customersService.findAll(filter);
  }

  @ApiOperation({ summary: 'Get customer statistics' })
  @ApiResponse({ status: 200, description: 'Customer statistics retrieved successfully' })
  @Get('stats')
  async getStats() {
    return this.customersService.getCustomerStats();
  }

  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @ApiOperation({ summary: 'Delete customer' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.customersService.remove(id);
  }

  @ApiOperation({ summary: 'Update customer score' })
  @ApiResponse({ status: 200, description: 'Customer score updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Patch(':id/score')
  async updateScore(
    @Param('id') id: string,
    @Body() body: { score: number },
  ): Promise<Customer> {
    return this.customersService.updateScore(id, body.score);
  }

  @ApiOperation({ summary: 'Calculate and update customer lifetime value' })
  @ApiResponse({ status: 200, description: 'Lifetime value calculated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Post(':id/calculate-ltv')
  async calculateLifetimeValue(@Param('id') id: string): Promise<{ lifetimeValue: number }> {
    const lifetimeValue = await this.customersService.calculateLifetimeValue(id);
    return { lifetimeValue };
  }
}