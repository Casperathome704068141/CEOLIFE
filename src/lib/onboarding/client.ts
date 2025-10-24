"use client";

import { Setup } from "./validators";
import { PreviewData, SaveResponse } from "./types";

export async function detectSetup(): Promise<SaveResponse["setup"] | null> {
  const response = await fetch("/api/onboarding/detect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) return null;
  const json = await response.json();
  return json.setup ?? null;
}

export async function persistSetup(setup: Setup, finalize = false, enableAutomations = true) {
  const payload = { setup, finalize, enableAutomations };
  const response = await fetch("/api/onboarding/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to save setup");
  }
  const json: SaveResponse = await response.json();
  return json;
}

export async function requestPreview(setup: Setup): Promise<PreviewData> {
  const response = await fetch("/api/onboarding/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ setup }),
  });
  if (!response.ok) {
    throw new Error("Failed to load preview");
  }
  return response.json();
}
