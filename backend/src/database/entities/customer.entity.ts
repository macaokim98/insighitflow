import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Address } from '@insightflow/shared';
import { Deal } from './deal.entity';
import { Interaction } from './interaction.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  phone: string;

  @Column('jsonb', { nullable: true })
  address: Address;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ default: 0 })
  score: number;

  @Column('decimal', {
    precision: 15,
    scale: 2,
    default: 0,
    name: 'lifetime_value',
  })
  lifetimeValue: number;

  @OneToMany(() => Deal, (deal) => deal.customer)
  deals: Deal[];

  @OneToMany(() => Interaction, (interaction) => interaction.customer)
  interactions: Interaction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}