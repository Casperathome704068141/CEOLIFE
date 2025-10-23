import { NextResponse } from "next/server";

export async function POST() {
  const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes
  const url = `https://secure.ceolife.app/vault/view/${Math.random().toString(36).slice(2)}`;
  return NextResponse.json({ url, expiresAt: expires.toISOString() });
}
