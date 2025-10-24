import { NextRequest } from "next/server";
import { WatchlistItem } from "@/lib/pulse/types";

type Body = { op: "add" | "remove" | "list"; item?: WatchlistItem };

let watchlist: WatchlistItem[] = [
  {
    id: "nfl-kc-buf",
    type: "game",
    league: "NFL",
    label: "Bills @ Chiefs",
    gameId: "nfl-kc-buf",
  },
];

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Body;

  if (body.op === "list") {
    return Response.json({ items: watchlist });
  }

  if (body.op === "add" && body.item) {
    const exists = watchlist.find((item) => item.id === body.item!.id);
    if (!exists) {
      watchlist = [...watchlist, body.item];
    }
    return Response.json({ items: watchlist });
  }

  if (body.op === "remove" && body.item) {
    watchlist = watchlist.filter((item) => item.id !== body.item!.id);
    return Response.json({ items: watchlist });
  }

  return new Response("Unsupported operation", { status: 400 });
}
