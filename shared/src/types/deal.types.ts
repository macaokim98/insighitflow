export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  customerId: string;
  assignedTo: string;
  expectedCloseDate: Date;
  notes: Note[];
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDealInput {
  title: string;
  value: number;
  currency?: string;
  stage: DealStage;
  customerId: string;
  assignedTo: string;
  expectedCloseDate: Date;
  notes?: string;
}

export interface UpdateDealInput {
  title?: string;
  value?: number;
  currency?: string;
  stage?: DealStage;
  probability?: number;
  assignedTo?: string;
  expectedCloseDate?: Date;
}

export enum DealStage {
  LEAD = 'LEAD',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

export interface Note {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ActivityType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  TASK = 'TASK',
  NOTE = 'NOTE',
}

export interface DealFilter {
  stage?: DealStage;
  assignedTo?: string;
  customerId?: string;
  minValue?: number;
  maxValue?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  page?: number;
  limit?: number;
}