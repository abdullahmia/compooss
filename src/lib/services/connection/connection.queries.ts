"use cache";

import { cacheTag, cacheLife } from "next/cache";
import { connectionStore } from "@/lib/store/connection.store";
import type { Connection, ConnectionDTO } from "@/lib/types";

function toDTO(conn: Connection): ConnectionDTO {
  const { uri: _uri, ...dto } = conn;
  return dto;
}

export async function getConnections(): Promise<ConnectionDTO[]> {
  cacheTag("connections");
  cacheLife("minutes");

  const connections = await connectionStore.readAll();
  return connections.map(toDTO);
}

export async function getConnectionById(
  id: string,
): Promise<ConnectionDTO | null> {
  cacheTag("connections", `connection:${id}`);
  cacheLife("minutes");

  const connection = await connectionStore.findById(id);
  return connection ? toDTO(connection) : null;
}
