import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { DealStage } from '@insightflow/shared';
import { Customer } from './customer.entity';
import { User } from './user.entity';
import { Note } from './note.entity';
import { Activity } from './activity.entity';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('decimal', { precision: 15, scale: 2 })
  value: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: DealStage,
    default: DealStage.LEAD,
  })
  stage: DealStage;

  @Column({ default: 0 })
  probability: number;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.deals)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'assigned_to' })
  assignedTo: string;

  @ManyToOne(() => User, (user) => user.deals)
  @JoinColumn({ name: 'assigned_to' })
  assignedUser: User;

  @Column({ name: 'expected_close_date', nullable: true })
  expectedCloseDate: Date;

  @OneToMany(() => Note, (note) => note.deal)
  notes: Note[];

  @OneToMany(() => Activity, (activity) => activity.deal)
  activities: Activity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}