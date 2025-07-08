import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../database/entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerFilterDto } from './dto/customer-filter.dto';
import { PaginatedResponse } from '@insightflow/shared';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Check if email already exists
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async findAll(filter: CustomerFilterDto): Promise<PaginatedResponse<Customer>> {
    const query = this.customerRepository.createQueryBuilder('customer');

    // Apply search filter
    if (filter.search) {
      query.andWhere(
        '(customer.email ILIKE :search OR customer.firstName ILIKE :search OR customer.lastName ILIKE :search OR customer.company ILIKE :search)',
        { search: `%${filter.search}%` },
      );
    }

    // Apply tags filter
    if (filter.tags && filter.tags.length > 0) {
      query.andWhere('customer.tags @> :tags', { tags: filter.tags });
    }

    // Apply score filters
    if (filter.minScore !== undefined) {
      query.andWhere('customer.score >= :minScore', { minScore: filter.minScore });
    }

    if (filter.maxScore !== undefined) {
      query.andWhere('customer.score <= :maxScore', { maxScore: filter.maxScore });
    }

    // Apply company filter
    if (filter.company) {
      query.andWhere('customer.company ILIKE :company', { company: `%${filter.company}%` });
    }

    // Apply sorting
    const sortField = filter.sortBy === 'lifetimeValue' ? 'customer.lifetimeValue' : 
                     filter.sortBy === 'score' ? 'customer.score' : 'customer.createdAt';
    query.orderBy(sortField, filter.sortOrder);

    // Apply pagination
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['deals', 'interactions'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    // Check email uniqueness if email is being updated
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: updateCustomerDto.email },
      });

      if (existingCustomer) {
        throw new ConflictException('Customer with this email already exists');
      }
    }

    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const result = await this.customerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  async updateScore(id: string, score: number): Promise<Customer> {
    const customer = await this.findOne(id);
    customer.score = score;
    return await this.customerRepository.save(customer);
  }

  async calculateLifetimeValue(id: string): Promise<number> {
    const result = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoin('customer.deals', 'deal')
      .select('SUM(deal.value)', 'totalValue')
      .where('customer.id = :id', { id })
      .andWhere('deal.stage = :stage', { stage: 'CLOSED_WON' })
      .getRawOne();

    const totalValue = Number(result.totalValue) || 0;

    // Update customer's lifetime value
    await this.customerRepository.update(id, { lifetimeValue: totalValue });

    return totalValue;
  }

  async getCustomerStats(): Promise<{
    total: number;
    newThisMonth: number;
    averageScore: number;
    totalLifetimeValue: number;
  }> {
    const total = await this.customerRepository.count();

    const newThisMonth = await this.customerRepository.count({
      where: {
        createdAt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    const avgScoreResult = await this.customerRepository
      .createQueryBuilder('customer')
      .select('AVG(customer.score)', 'averageScore')
      .getRawOne();

    const totalValueResult = await this.customerRepository
      .createQueryBuilder('customer')
      .select('SUM(customer.lifetimeValue)', 'totalValue')
      .getRawOne();

    return {
      total,
      newThisMonth,
      averageScore: Number(avgScoreResult.averageScore) || 0,
      totalLifetimeValue: Number(totalValueResult.totalValue) || 0,
    };
  }
}