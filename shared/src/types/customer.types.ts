import { Address } from './common.types';

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  address?: Address;
  tags: string[];
  score: number;
  lifetimeValue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  address?: Address;
  tags?: string[];
}

export interface UpdateCustomerInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  address?: Address;
  tags?: string[];
  score?: number;
}

export interface CustomerFilter {
  search?: string;
  tags?: string[];
  minScore?: number;
  maxScore?: number;
  company?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'score' | 'lifetimeValue';
  sortOrder?: 'ASC' | 'DESC';
}

export enum CustomerSegment {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  VIP = 'VIP',
  AT_RISK = 'AT_RISK',
  CHURNED = 'CHURNED',
}