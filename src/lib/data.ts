import type { Bill, ScheduleEvent, CashflowData, SavingsGoal, Document, ShoppingItem } from '@/lib/types';
import { CreditCard, Home, ShoppingBasket, Plane, Car, VenetianMask, Utensils, Wifi, Droplets } from 'lucide-react';

export const netWorth = 125630.75;

export const bills: Bill[] = [
  { name: "Rent", amount: 2000, dueDate: "1st", icon: Home },
  { name: "Credit Card", amount: 750.21, dueDate: "8th", icon: CreditCard },
  { name: "Internet", amount: 79.99, dueDate: "15th", icon: Wifi },
  { name: "Utilities", amount: 120.50, dueDate: "22nd", icon: Droplets },
];

export const schedule: ScheduleEvent[] = [
  { time: "9:00 AM", title: "Morning Briefing", description: "Sync with BENO" },
  { time: "11:00 AM", title: "Project Titan Call", description: "Discuss Q3 roadmap" },
  { time: "2:30 PM", title: "Dentist Appointment", description: "Annual check-up" },
  { time: "7:00 PM", title: "Dinner with Alex", description: "At The Downtown Diner" },
];

export const cashflowData: CashflowData[] = [
  { month: 'Jan', income: 5000, expenses: 3200 },
  { month: 'Feb', income: 5100, expenses: 3500 },
  { month: 'Mar', income: 5250, expenses: 3100 },
  { month: 'Apr', income: 5200, expenses: 4000 },
  { month: 'May', income: 5300, expenses: 3400 },
  { month: 'Jun', income: 5500, expenses: 3600 },
];

export const savingsGoals: SavingsGoal[] = [
  { name: "Vacation to Japan", target: 8000, current: 5200, description: "Trip for next spring" },
  { name: "New Car", target: 35000, current: 12500, description: "Upgrade to an EV" },
  { name: "Emergency Fund", target: 15000, current: 15000, description: "6 months of expenses" },
];

export const documents: Document[] = [
  { name: "Passport.pdf", type: "Identification", date: "2023-01-15", icon: Plane },
  { name: "Lease_Agreement.docx", type: "Housing", date: "2023-08-01", icon: Home },
  { name: "Car_Insurance.pdf", type: "Vehicle", date: "2024-01-01", icon: Car },
];

export const shoppingList: ShoppingItem[] = [
  { id: 1, name: "Oat Milk", checked: false },
  { id: 2, name: "Artisanal Bread", checked: true },
  { id: 3, name: "Avocados", checked: false },
  { id: 4, name: "Espresso Pods", checked: false },
  { id: 5, name: "Paper Towels", checked: true },
];
