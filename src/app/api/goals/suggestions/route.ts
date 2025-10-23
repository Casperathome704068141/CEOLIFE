import { NextResponse } from "next/server";
import { computeAutomationSuggestion } from "../store";

export async function GET() {
  const suggestion = await computeAutomationSuggestion();
  return NextResponse.json(suggestion);
}
