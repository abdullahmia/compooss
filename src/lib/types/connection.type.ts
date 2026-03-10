export interface Connection {
  id: string;
  name: string;
  uri: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export type ConnectionDTO = Omit<Connection, "uri">;
