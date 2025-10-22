// src/ai/flows/extract-data-from-screenshots.ts
'use server';
/**
 * @fileOverview Extracts data from uploaded screenshots of receipts, banking apps, and other documents.
 *
 * - extractDataFromScreenshot - A function that handles the data extraction process.
 * - ExtractDataFromScreenshotInput - The input type for the extractDataFromScreenshot function.
 * - ExtractDataFromScreenshotOutput - The return type for the extractDataFromScreenshot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractDataFromScreenshotInputSchema = z.object({
  screenshotDataUri: z
    .string()
    .describe(
      'A screenshot as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // keep the backslashes, it's valid json
    ),
});
export type ExtractDataFromScreenshotInput = z.infer<typeof ExtractDataFromScreenshotInputSchema>;

const ExtractDataFromScreenshotOutputSchema = z.object({
  extractedText: z.string().describe('The extracted text from the screenshot.'),
  amount: z.number().optional().describe('The amount extracted from the screenshot, if any.'),
  category: z.string().optional().describe('The category inferred from the screenshot, if any.'),
});
export type ExtractDataFromScreenshotOutput = z.infer<typeof ExtractDataFromScreenshotOutputSchema>;

export async function extractDataFromScreenshot(input: ExtractDataFromScreenshotInput): Promise<ExtractDataFromScreenshotOutput> {
  return extractDataFromScreenshotFlow(input);
}

const extractDataFromScreenshotPrompt = ai.definePrompt({
  name: 'extractDataFromScreenshotPrompt',
  input: {schema: ExtractDataFromScreenshotInputSchema},
  output: {schema: ExtractDataFromScreenshotOutputSchema},
  prompt: `You are an AI assistant tasked with extracting data from screenshots.

  Analyze the provided screenshot and extract the relevant information, including text, amounts, and categories.

  Screenshot: {{media url=screenshotDataUri}}

  Output the extracted text, amount (if any), and category (if any) in the specified JSON format.
  If no amount or category is found, omit those fields from the JSON.`,
});

const extractDataFromScreenshotFlow = ai.defineFlow(
  {
    name: 'extractDataFromScreenshotFlow',
    inputSchema: ExtractDataFromScreenshotInputSchema,
    outputSchema: ExtractDataFromScreenshotOutputSchema,
  },
  async input => {
    const {output} = await extractDataFromScreenshotPrompt(input);
    return output!;
  }
);
