export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'low';
  dueDate: string;
  completed: boolean;
}

export interface TaskGroup {
  id: string;
  name: string;
  status: 'in-progress' | 'to-do' | 'upcoming';
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  icon: string;
  color: string;
  teammates: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  attendees: { name: string; avatar: string }[];
  meetLink?: string;
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
  color: string;
}

export interface Reminder {
  id: string;
  title: string;
  time?: string;
}

export const taskGroups: TaskGroup[] = [
  {
    id: '1',
    name: 'In Progress',
    status: 'in-progress',
    tasks: [
      { id: '1-1', title: 'Complete project proposal', priority: 'high', dueDate: 'Today', completed: false },
      { id: '1-2', title: 'Review design mockups', priority: 'low', dueDate: 'Tomorrow', completed: false },
    ],
  },
  {
    id: '2',
    name: 'To Do',
    status: 'to-do',
    tasks: [
      { id: '2-1', title: 'Update documentation', priority: 'low', dueDate: 'Jan 25', completed: false },
      { id: '2-2', title: 'Team sync meeting prep', priority: 'high', dueDate: 'Jan 24', completed: false },
    ],
  },
  {
    id: '3',
    name: 'Upcoming',
    status: 'upcoming',
    tasks: [
      { id: '3-1', title: 'Quarterly review', priority: 'high', dueDate: 'Jan 30', completed: false },
    ],
  },
];

export const projects: Project[] = [
  { id: '1', name: 'Product launch', icon: '🚀', color: 'bg-orange-100', teammates: 5 },
  { id: '2', name: 'Team brainstorm', icon: '💡', color: 'bg-yellow-100', teammates: 3 },
  { id: '3', name: 'Branding launch', icon: '🎨', color: 'bg-purple-100', teammates: 4 },
];

export const sidebarProjects = [
  { id: '1', name: 'Product launch', color: 'bg-orange-400' },
  { id: '2', name: 'Team brainstorm', color: 'bg-yellow-400' },
  { id: '3', name: 'Branding launch', color: 'bg-purple-400' },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team sync',
    time: '10:00 AM',
    attendees: [
      { name: 'John', avatar: 'J' },
      { name: 'Sarah', avatar: 'S' },
      { name: 'Mike', avatar: 'M' },
    ],
    meetLink: 'https://meet.google.com',
  },
];

export const goals: Goal[] = [
  { id: '1', title: 'Complete Q1 objectives', progress: 75, color: 'bg-primary' },
  { id: '2', title: 'Learn new framework', progress: 45, color: 'bg-orange-500' },
  { id: '3', title: 'Improve productivity', progress: 90, color: 'bg-green-500' },
];

export const reminders: Reminder[] = [
  { id: '1', title: 'Send weekly report', time: '2:00 PM' },
  { id: '2', title: 'Review pull requests', time: '4:00 PM' },
  { id: '3', title: 'Update project status' },
];

export const weekDays = [
  { day: 'Mon', date: 20, isToday: false },
  { day: 'Tue', date: 21, isToday: false },
  { day: 'Wed', date: 22, isToday: false },
  { day: 'Thu', date: 23, isToday: true },
  { day: 'Fri', date: 24, isToday: false },
  { day: 'Sat', date: 25, isToday: false },
  { day: 'Sun', date: 26, isToday: false },
];

export interface Generation {
  id: string;
  name: string;
  type: 'image' | 'text' | 'code' | 'design';
  status: 'completed' | 'processing' | 'failed' | 'pending';
  createdAt: string;
  updatedAt: string;
  prompt?: string;
}

export const generations: Generation[] = [
  {
    id: '1',
    name: 'Product Landing Page',
    type: 'design',
    status: 'completed',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:35:00Z',
    prompt: 'Create a modern landing page for a SaaS product',
  },
  {
    id: '2',
    name: 'API Documentation',
    type: 'code',
    status: 'completed',
    createdAt: '2024-01-19T14:20:00Z',
    updatedAt: '2024-01-19T14:25:00Z',
    prompt: 'Generate REST API documentation',
  },
  {
    id: '3',
    name: 'Marketing Banner',
    type: 'image',
    status: 'processing',
    createdAt: '2024-01-23T09:15:00Z',
    updatedAt: '2024-01-23T09:15:00Z',
    prompt: 'Create a promotional banner for summer sale',
  },
  {
    id: '4',
    name: 'Blog Post Introduction',
    type: 'text',
    status: 'completed',
    createdAt: '2024-01-22T16:45:00Z',
    updatedAt: '2024-01-22T16:50:00Z',
    prompt: 'Write an engaging introduction for a tech blog post',
  },
  {
    id: '5',
    name: 'Dashboard Component',
    type: 'code',
    status: 'failed',
    createdAt: '2024-01-21T11:00:00Z',
    updatedAt: '2024-01-21T11:05:00Z',
    prompt: 'Generate a React dashboard component',
  },
  {
    id: '6',
    name: 'Logo Design',
    type: 'design',
    status: 'pending',
    createdAt: '2024-01-23T08:30:00Z',
    updatedAt: '2024-01-23T08:30:00Z',
    prompt: 'Design a minimalist logo for a tech startup',
  },
  {
    id: '7',
    name: 'Email Template',
    type: 'design',
    status: 'completed',
    createdAt: '2024-01-18T13:20:00Z',
    updatedAt: '2024-01-18T13:25:00Z',
    prompt: 'Create a responsive email template',
  },
  {
    id: '8',
    name: 'Data Processing Script',
    type: 'code',
    status: 'completed',
    createdAt: '2024-01-17T15:10:00Z',
    updatedAt: '2024-01-17T15:15:00Z',
    prompt: 'Generate Python script for data processing',
  },
];

export interface Store {
  id: string;
  name: string;
  category: 'template' | 'component' | 'asset' | 'plugin';
  status: 'active' | 'inactive' | 'pending';
  price: number;
  sales: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export const stores: Store[] = [
  {
    id: '1',
    name: 'Modern Dashboard Template',
    category: 'template',
    status: 'active',
    price: 49.99,
    sales: 234,
    rating: 4.8,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-22T14:30:00Z',
  },
  {
    id: '2',
    name: 'Button Component Pack',
    category: 'component',
    status: 'active',
    price: 19.99,
    sales: 567,
    rating: 4.9,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-20T11:15:00Z',
  },
  {
    id: '3',
    name: 'Icon Set Pro',
    category: 'asset',
    status: 'active',
    price: 29.99,
    sales: 892,
    rating: 4.7,
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: '4',
    name: 'Form Builder Plugin',
    category: 'plugin',
    status: 'pending',
    price: 39.99,
    sales: 0,
    rating: 0,
    createdAt: '2024-01-23T12:00:00Z',
    updatedAt: '2024-01-23T12:00:00Z',
  },
  {
    id: '5',
    name: 'E-commerce Template',
    category: 'template',
    status: 'active',
    price: 79.99,
    sales: 145,
    rating: 4.6,
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-21T10:20:00Z',
  },
  {
    id: '6',
    name: 'Animation Library',
    category: 'component',
    status: 'inactive',
    price: 24.99,
    sales: 312,
    rating: 4.5,
    createdAt: '2024-01-05T07:00:00Z',
    updatedAt: '2024-01-19T13:30:00Z',
  },
  {
    id: '7',
    name: 'Premium Illustrations',
    category: 'asset',
    status: 'active',
    price: 59.99,
    sales: 678,
    rating: 4.9,
    createdAt: '2024-01-03T06:00:00Z',
    updatedAt: '2024-01-17T15:00:00Z',
  },
  {
    id: '8',
    name: 'Data Table Component',
    category: 'component',
    status: 'active',
    price: 34.99,
    sales: 423,
    rating: 4.7,
    createdAt: '2024-01-14T10:30:00Z',
    updatedAt: '2024-01-22T09:45:00Z',
  },
];

export interface Credit {
  id: string;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  balance: number;
}

export const credits: Credit[] = [
  {
    id: '1',
    type: 'purchase',
    amount: 100,
    description: 'Purchased 100 credits',
    status: 'completed',
    createdAt: '2024-01-23T10:00:00Z',
    balance: 150,
  },
  {
    id: '2',
    type: 'usage',
    amount: -25,
    description: 'Used for image generation',
    status: 'completed',
    createdAt: '2024-01-23T09:30:00Z',
    balance: 50,
  },
  {
    id: '3',
    type: 'usage',
    amount: -15,
    description: 'Used for code generation',
    status: 'completed',
    createdAt: '2024-01-22T16:20:00Z',
    balance: 75,
  },
  {
    id: '4',
    type: 'bonus',
    amount: 50,
    description: 'Welcome bonus credits',
    status: 'completed',
    createdAt: '2024-01-22T14:00:00Z',
    balance: 90,
  },
  {
    id: '5',
    type: 'usage',
    amount: -10,
    description: 'Used for text generation',
    status: 'completed',
    createdAt: '2024-01-21T11:15:00Z',
    balance: 40,
  },
  {
    id: '6',
    type: 'purchase',
    amount: 200,
    description: 'Purchased 200 credits',
    status: 'pending',
    createdAt: '2024-01-21T10:00:00Z',
    balance: 50,
  },
  {
    id: '7',
    type: 'usage',
    amount: -30,
    description: 'Used for design generation',
    status: 'completed',
    createdAt: '2024-01-20T15:30:00Z',
    balance: 50,
  },
  {
    id: '8',
    type: 'refund',
    amount: 20,
    description: 'Refund for failed generation',
    status: 'completed',
    createdAt: '2024-01-19T13:00:00Z',
    balance: 80,
  },
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2024-01-23T09:30:00Z',
    avatar: 'JD',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-16T11:00:00Z',
    lastLogin: '2024-01-23T08:15:00Z',
    avatar: 'JS',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'moderator',
    status: 'active',
    createdAt: '2024-01-17T12:00:00Z',
    lastLogin: '2024-01-22T16:45:00Z',
    avatar: 'MJ',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-01-18T13:00:00Z',
    lastLogin: '2024-01-20T14:20:00Z',
    avatar: 'SW',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-19T14:00:00Z',
    lastLogin: '2024-01-23T10:10:00Z',
    avatar: 'DB',
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'user',
    status: 'suspended',
    createdAt: '2024-01-20T15:00:00Z',
    lastLogin: '2024-01-21T11:30:00Z',
    avatar: 'ED',
  },
  {
    id: '7',
    name: 'Chris Wilson',
    email: 'chris.wilson@example.com',
    role: 'moderator',
    status: 'active',
    createdAt: '2024-01-21T16:00:00Z',
    lastLogin: '2024-01-23T07:45:00Z',
    avatar: 'CW',
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-22T17:00:00Z',
    lastLogin: '2024-01-23T12:00:00Z',
    avatar: 'LA',
  },
];

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  credits: number;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export const plans: Plan[] = [
  {
    id: '1',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    billingCycle: 'monthly',
    features: ['10 credits/month', 'Basic support', 'Standard templates'],
    credits: 10,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Starter',
    description: 'For small projects',
    price: 9.99,
    billingCycle: 'monthly',
    features: ['100 credits/month', 'Priority support', 'Premium templates', 'API access'],
    credits: 100,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Professional',
    description: 'For growing businesses',
    price: 29.99,
    billingCycle: 'monthly',
    features: ['500 credits/month', '24/7 support', 'All templates', 'API access', 'Custom integrations'],
    credits: 500,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 99.99,
    billingCycle: 'monthly',
    features: ['Unlimited credits', 'Dedicated support', 'All features', 'Custom solutions', 'SLA guarantee'],
    credits: -1, // -1 means unlimited
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Legacy Plan',
    description: 'Deprecated plan',
    price: 19.99,
    billingCycle: 'monthly',
    features: ['50 credits/month', 'Basic support'],
    credits: 50,
    status: 'archived',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'crypto';
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export const payments: Payment[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    planId: '3',
    planName: 'Professional',
    amount: 29.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'credit_card',
    transactionId: 'txn_1234567890',
    createdAt: '2024-01-23T10:00:00Z',
    updatedAt: '2024-01-23T10:00:00Z',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    planId: '2',
    planName: 'Starter',
    amount: 9.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'paypal',
    transactionId: 'txn_0987654321',
    createdAt: '2024-01-22T14:30:00Z',
    updatedAt: '2024-01-22T14:30:00Z',
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Johnson',
    planId: '4',
    planName: 'Enterprise',
    amount: 99.99,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'bank_transfer',
    transactionId: 'txn_1122334455',
    createdAt: '2024-01-22T09:15:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
  },
  {
    id: '4',
    userId: '4',
    userName: 'Sarah Williams',
    planId: '2',
    planName: 'Starter',
    amount: 9.99,
    currency: 'USD',
    status: 'failed',
    paymentMethod: 'credit_card',
    transactionId: 'txn_5566778899',
    createdAt: '2024-01-21T16:45:00Z',
    updatedAt: '2024-01-21T16:45:00Z',
  },
  {
    id: '5',
    userId: '5',
    userName: 'David Brown',
    planId: '3',
    planName: 'Professional',
    amount: 29.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'credit_card',
    transactionId: 'txn_9988776655',
    createdAt: '2024-01-20T11:20:00Z',
    updatedAt: '2024-01-20T11:20:00Z',
  },
  {
    id: '6',
    userId: '6',
    userName: 'Emily Davis',
    planId: '2',
    planName: 'Starter',
    amount: 9.99,
    currency: 'USD',
    status: 'refunded',
    paymentMethod: 'paypal',
    transactionId: 'txn_4433221100',
    createdAt: '2024-01-19T13:10:00Z',
    updatedAt: '2024-01-20T08:30:00Z',
  },
  {
    id: '7',
    userId: '7',
    userName: 'Chris Wilson',
    planId: '4',
    planName: 'Enterprise',
    amount: 99.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'credit_card',
    transactionId: 'txn_7788990011',
    createdAt: '2024-01-18T15:30:00Z',
    updatedAt: '2024-01-18T15:30:00Z',
  },
  {
    id: '8',
    userName: 'Lisa Anderson',
    userId: '8',
    planId: '2',
    planName: 'Starter',
    amount: 9.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'crypto',
    transactionId: 'txn_2233445566',
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
  },
];