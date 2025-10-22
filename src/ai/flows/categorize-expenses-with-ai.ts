'use server';
/**
 * @fileOverview This file contains a Genkit flow for categorizing expenses using AI.
 *
 * The flow takes a financial statement as input and returns a categorized list of expenses.
 * - categorizeExpenses - An exported function that takes financial statement data and categorizes expenses.
 * - CategorizeExpensesInput - The input type for categorizeExpenses, representing financial statement data.
 * - CategorizeExpensesOutput - The output type, representing a categorized list of expenses.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeExpensesInputSchema = z.object({
  financialStatement: z
    .string()
    .describe(
      'A financial statement, which could be a bank statement, credit card statement, or other financial document.'
    ),
});
export type CategorizeExpensesInput = z.infer<typeof CategorizeExpensesInputSchema>;

const CategorizeExpensesOutputSchema = z.object({
  categorizedExpenses: z.array(
    z.object({
      description: z.string().describe('A description of the expense.'),
      category: z.string().describe('The category of the expense (e.g., food, transportation, utilities).'),
      amount: z.number().describe('The amount of the expense.'),
    })
  ).describe('A list of categorized expenses.'),
});
export type CategorizeExpensesOutput = z.infer<typeof CategorizeExpensesOutputSchema>;

export async function categorizeExpenses(input: CategorizeExpensesInput): Promise<CategorizeExpensesOutput> {
  return categorizeExpensesFlow(input);
}

const categorizeExpensesPrompt = ai.definePrompt({
  name: 'categorizeExpensesPrompt',
  input: {schema: CategorizeExpensesInputSchema},
  output: {schema: CategorizeExpensesOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing financial statements and categorizing expenses.
  Given the following financial statement, extract all expenses and categorize them into appropriate categories such as food, transportation, utilities, etc.
  Return a JSON array of categorized expenses, each with a description, category, and amount.

  Financial Statement:
  {{financialStatement}}`,
});

const categorizeExpensesFlow = ai.defineFlow(
  {
    name: 'categorizeExpensesFlow',
    inputSchema: CategorizeExpensesInputSchema,
    outputSchema: CategorizeExpensesOutputSchema,
  },
  async input => {
    const {output} = await categorizeExpensesPrompt(input);
    return output!;
  }
);


