'use server';

/**
 * @fileOverview This file defines the AI concierge flow for generating daily and weekly summaries.
 *
 * The flow uses a prompt to generate summaries based on user data related to finances, schedule, and wellness.
 * It exports:
 *   - aiConciergeSummaries: The main function to trigger the flow.
 *   - AiConciergeSummariesInput: The input type for the aiConciergeSummaries function.
 *   - AiConciergeSummariesOutput: The output type for the aiConciergeSummaries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiConciergeSummariesInputSchema = z.object({
  financeData: z.string().describe('Summary of financial data.'),
  scheduleData: z.string().describe('Summary of schedule data.'),
  wellnessData: z.string().describe('Summary of wellness data.'),
  summaryType: z
    .enum(['morningBrief', 'nightSummary', 'weeklyReview'])
    .describe('Type of summary to generate.'),
});
export type AiConciergeSummariesInput = z.infer<typeof AiConciergeSummariesInputSchema>;

const AiConciergeSummariesOutputSchema = z.object({
  summary: z.string().describe('The generated summary.'),
});
export type AiConciergeSummariesOutput = z.infer<typeof AiConciergeSummariesOutputSchema>;

export async function aiConciergeSummaries(input: AiConciergeSummariesInput): Promise<AiConciergeSummariesOutput> {
  return aiConciergeSummariesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiConciergeSummariesPrompt',
  input: {schema: AiConciergeSummariesInputSchema},
  output: {schema: AiConciergeSummariesOutputSchema},
  prompt: `You are an AI concierge providing summaries to the user.

  You will receive financial, schedule, and wellness data, and you must generate a summary based on the summaryType.

  Summary Type: {{{summaryType}}}

  Financial Data: {{{financeData}}}
  Schedule Data: {{{scheduleData}}}
  Wellness Data: {{{wellnessData}}}

  Generate a concise and informative summary.`,
});

const aiConciergeSummariesFlow = ai.defineFlow(
  {
    name: 'aiConciergeSummariesFlow',
    inputSchema: AiConciergeSummariesInputSchema,
    outputSchema: AiConciergeSummariesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
