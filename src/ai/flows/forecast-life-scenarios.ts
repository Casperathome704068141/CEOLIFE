'use server';

/**
 * @fileOverview A flow that forecasts the impact of life scenarios on finances and time.
 *
 * - forecastLifeScenario - A function that handles the life scenario forecasting.
 * - ForecastLifeScenarioInput - The input type for the forecastLifeScenario function.
 * - ForecastLifeScenarioOutput - The return type for the forecastLifeScenario function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastLifeScenarioInputSchema = z.object({
  scenarioDescription: z
    .string()
    .describe('A description of the life scenario to forecast.'),
  currentSavings: z.number().describe('The user\'s current savings balance.'),
  monthlyIncome: z.number().describe('The user\'s current monthly income.'),
  monthlyExpenses: z.number().describe('The user\'s current monthly expenses.'),
});
export type ForecastLifeScenarioInput = z.infer<typeof ForecastLifeScenarioInputSchema>;

const ForecastLifeScenarioOutputSchema = z.object({
  financialImpactSummary: z
    .string()
    .describe('A summary of the financial impact of the scenario.'),
  timelineGraphData: z
    .string()
    .describe(
      'Data for a timeline graph showing the impact on savings over time.  The format of the data is not specified, but should be suitable for rendering in a graph component.'
    ),
  cashflowProjection: z
    .string()
    .describe('A projection of cash flow, taking into account the scenario.'),
});
export type ForecastLifeScenarioOutput = z.infer<typeof ForecastLifeScenarioOutputSchema>;

export async function forecastLifeScenario(
  input: ForecastLifeScenarioInput
): Promise<ForecastLifeScenarioOutput> {
  return forecastLifeScenarioFlow(input);
}

const forecastLifeScenarioPrompt = ai.definePrompt({
  name: 'forecastLifeScenarioPrompt',
  input: {schema: ForecastLifeScenarioInputSchema},
  output: {schema: ForecastLifeScenarioOutputSchema},
  prompt: `You are a financial advisor.  Given the following life scenario, current savings, monthly income, and monthly expenses, provide a financial impact summary, timeline graph data, and cashflow projection.

Life Scenario: {{{scenarioDescription}}}
Current Savings: {{{currentSavings}}}
Monthly Income: {{{monthlyIncome}}}
Monthly Expenses: {{{monthlyExpenses}}}

Financial Impact Summary: A summary of the financial impact of the scenario.
Timeline Graph Data: Data for a timeline graph showing the impact on savings over time.  The format of the data is not specified, but should be suitable for rendering in a graph component.
Cashflow Projection: A projection of cash flow, taking into account the scenario.`,
});

const forecastLifeScenarioFlow = ai.defineFlow(
  {
    name: 'forecastLifeScenarioFlow',
    inputSchema: ForecastLifeScenarioInputSchema,
    outputSchema: ForecastLifeScenarioOutputSchema,
  },
  async input => {
    const {output} = await forecastLifeScenarioPrompt(input);
    return output!;
  }
);
