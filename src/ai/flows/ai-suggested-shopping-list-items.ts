'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting shopping list items based on user's purchase history and household needs.
 *
 * - aiSuggestShoppingListItems - A function that suggests shopping list items.
 * - AISuggestShoppingListItemsInput - The input type for the aiSuggestShoppingListItems function.
 * - AISuggestShoppingListItemsOutput - The return type for the aiSuggestShoppingListItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISuggestShoppingListItemsInputSchema = z.object({
  previousPurchases: z
    .array(z.string())
    .describe('A list of items the user has previously purchased.'),
  householdNeeds: z
    .string()
    .describe('A description of the current household needs.'),
});
export type AISuggestShoppingListItemsInput = z.infer<
  typeof AISuggestShoppingListItemsInputSchema
>;

const AISuggestShoppingListItemsOutputSchema = z.object({
  suggestedItems: z
    .array(z.string())
    .describe('A list of suggested shopping list items.'),
});
export type AISuggestShoppingListItemsOutput = z.infer<
  typeof AISuggestShoppingListItemsOutputSchema
>;

export async function aiSuggestShoppingListItems(
  input: AISuggestShoppingListItemsInput
): Promise<AISuggestShoppingListItemsOutput> {
  return aiSuggestShoppingListItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSuggestShoppingListItemsPrompt',
  input: {schema: AISuggestShoppingListItemsInputSchema},
  output: {schema: AISuggestShoppingListItemsOutputSchema},
  prompt: `You are a helpful AI assistant that suggests shopping list items based on past purchases and current household needs.

  Previous Purchases: {{previousPurchases}}
  Household Needs: {{householdNeeds}}

  Please provide a list of suggested items to add to the shopping list.
  Format the suggested items as a simple array of strings.`,
});

const aiSuggestShoppingListItemsFlow = ai.defineFlow(
  {
    name: 'aiSuggestShoppingListItemsFlow',
    inputSchema: AISuggestShoppingListItemsInputSchema,
    outputSchema: AISuggestShoppingListItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
