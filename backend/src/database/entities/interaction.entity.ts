import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { User } from './user.entity';

export enum InteractionType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  CHAT = 'CHAT',
  SOCIAL = 'SOCIAL',
}

export enum Channel {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  WEBSITE = 'WEBSITE',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  IN_PERSON = 'IN_PERSON',
}

export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
}

@Entity('interactions')
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.interactions)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({
    type: 'enum',
    enum: InteractionType,
  })
  type: InteractionType;

  @Column({
    type: 'enum',
    enum: Channel,
  })
  channel: Channel;

  @Column({ nullable: true })
  subject: string;

  @Column('text', { nullable: true })
  content: string;

  @Column({
    type: 'enum',
    enum: Sentiment,
    nullable: true,
  })
  sentiment: Sentiment;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}