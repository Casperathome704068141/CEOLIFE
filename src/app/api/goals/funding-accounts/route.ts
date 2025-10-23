import { NextResponse } from "next/server";
import { listFundingAccounts } from "../store";

export async function GET() {
  const accounts = await listFundingAccounts();
  return NextResponse.json(accounts);
}
