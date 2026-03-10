"use server";

import { updateTag } from "next/cache";
import { randomUUID } from "crypto";
import { connectionStore } from "@/lib/store/connection.store";
import { testConnection } from "@/lib/driver/mongodb.driver";
import { withServiceError } from "@/lib/config/error.config";
import type { Connection, ConnectionDTO } from "@/lib/types";
import type { TConnectionSchema } from "@/lib/schemas/connection.schema";

function toDTO(conn: Connection): ConnectionDTO {
  const { uri: _uri, ...dto } = conn;
  return dto;
}

export async function createConnection(
  payload: TConnectionSchema,
): Promise<ConnectionDTO> {
  return withServiceError("Failed to create connection", async () => {
    await testConnection(payload.connectionString);

    const conn: Connection = {
      id: randomUUID(),
      name: payload.connectionName,
      uri: payload.connectionString,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
    };

    await connectionStore.save(conn);
    updateTag("connections");

    return toDTO(conn);
  });
}

export async function deleteConnection(id: string): Promise<void> {
  return withServiceError("Failed to delete connection", async () => {
    await connectionStore.delete(id);
    updateTag("connections");
    updateTag(`connection:${id}`);
  });
}

export async function touchConnection(id: string): Promise<void> {
  return withServiceError("Failed to update connection", async () => {
    await connectionStore.touch(id);
    updateTag("connections");
    updateTag(`connection:${id}`);
  });
}
