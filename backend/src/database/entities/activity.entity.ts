import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ActivityType } from '@insightflow/shared';
import { Deal } from './deal.entity';
import { User } from './user.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  type: ActivityType;

  @Column()
  subject: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ name: 'due_date', nullable: true })
  dueDate: Date;

  @Column({ default: false })
  completed: boolean;

  @Column({ name: 'deal_id', nullable: true })
  dealId: string;

  @ManyToOne(() => Deal, (deal) => deal.activities)
  @JoinColumn({ name: 'deal_id' })
  deal: Deal;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}