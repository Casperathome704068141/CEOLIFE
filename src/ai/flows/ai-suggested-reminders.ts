'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting reminders based on user messages and screenshots.
 *
 * The flow takes message and screenshot data as input, analyzes it using AI, and suggests reminders to the user.
 * The file exports:
 * - `suggestReminders`: An async function that triggers the reminder suggestion flow.
 * - `SuggestRemindersInput`: The interface for the input data.
 * - `SuggestRemindersOutput`: The interface for the output data (suggested reminders).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRemindersInputSchema = z.object({
  text: z.string().describe('The text content from messages or screenshots.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestRemindersInput = z.infer<typeof SuggestRemindersInputSchema>;

const SuggestRemindersOutputSchema = z.object({
  reminders: z
    .array(
      z.object({
        title: z.string().describe('The title of the suggested reminder.'),
        dateTime: z.string().describe('The date and time for the reminder (ISO format).'),
        description: z.string().optional().describe('Optional description for the reminder.'),
      })
    )
    .describe('A list of suggested reminders.'),
});
export type SuggestRemindersOutput = z.infer<typeof SuggestRemindersOutputSchema>;

export async function suggestReminders(input: SuggestRemindersInput): Promise<SuggestRemindersOutput> {
  return suggestRemindersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRemindersPrompt',
  input: {schema: SuggestRemindersInputSchema},
  output: {schema: SuggestRemindersOutputSchema},
  prompt: `You are a personal assistant AI that analyzes text and images to suggest reminders to the user.

  Analyze the following text and image (if available) and extract any potential reminders.

  Text: {{{text}}}
  {{#if photoDataUri}}
  Image: {{media url=photoDataUri}}
  {{/if}}

  Suggest reminders with a title, date, and time.
  The dateTime must be in ISO format. Provide a description if necessary.

  Return the reminders as a JSON array.
  `,
});

const suggestRemindersFlow = ai.defineFlow(
  {
    name: 'suggestRemindersFlow',
    inputSchema: SuggestRemindersInputSchema,
    outputSchema: SuggestRemindersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
