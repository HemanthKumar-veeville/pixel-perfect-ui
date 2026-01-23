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
