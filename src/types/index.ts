export type UserRole = 'vendor' | 'pharmacist' | 'management';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar_url?: string;
}

export type ConversationStatus = 'ongoing' | 'waiting' | 'completed';
export type ConversationType = 'vendor' | 'pharmacist';

export interface Conversation {
  id: string;
  customer_name: string;
  customer_phone: string;
  last_message: string;
  last_message_time: string;
  status: ConversationStatus;
  type: ConversationType;
  assigned_to?: string;
  is_new?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  category: string;
  requires_prescription: boolean;
  image_url?: string;
}

export interface MetricData {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  unit?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}