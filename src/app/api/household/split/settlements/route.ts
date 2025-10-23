import { NextResponse } from "next/server";
import { getHouseholdStore } from "../../store";

export async function GET() {
  return NextResponse.json(getHouseholdStore().settlements);
}
