import { config } from 'dotenv';
config();

import '@/ai/flows/forecast-life-scenarios.ts';
import '@/ai/flows/ai-concierge-summaries.ts';
import '@/ai/flows/extract-data-from-screenshots.ts';
import '@/ai/flows/ai-suggested-shopping-list-items.ts';
import '@/ai/flows/categorize-expenses-with-ai.ts';
import '@/ai/flows/ai-suggested-reminders.ts';