import { NextResponse } from "next/server";
import { SaveRequest, SaveResponse } from "@/lib/onboarding/types";
import { SetupSchema } from "@/lib/onboarding/validators";
import { mergeSetup, setServerSetup } from "@/lib/onboarding/serverState";
import { writeBackToCollections } from "@/lib/onboarding/writeBack";

export async function POST(request: Request) {
  const body: SaveRequest = await request.json();
  const parsed = SetupSchema.safeParse(body.setup);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const setup = mergeSetup(parsed.data);

  let created: SaveResponse["created"] | undefined;
  let warnings: SaveResponse["warnings"] | undefined;

  if (body.finalize) {
    const result = await writeBackToCollections(setup, body.enableAutomations ?? true);
    created = result.created;
    warnings = result.warnings;
    setup.progress = 100;
    setServerSetup(setup);
  }

  const response: SaveResponse = {
    ok: true,
    setup,
    created,
    warnings,
  };

  return NextResponse.json(response);
}
