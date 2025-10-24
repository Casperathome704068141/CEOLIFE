import { randomUUID } from "crypto";

type Client = {
  id: string;
  send: (data: string) => void;
};

const clients = new Map<string, Client>();

export function registerClient(send: Client["send"]) {
  const id = randomUUID();
  const client: Client = { id, send };
  clients.set(id, client);
  return () => {
    clients.delete(id);
  };
}

export function broadcastProjectionUpdate(keys: string[]) {
  const payload = JSON.stringify({ keys });
  for (const client of clients.values()) {
    client.send(`data: ${payload}\n\n`);
  }
}

