import { connectionManager } from "@/lib/driver/connection-manager";
import { withLogging } from "@/lib/logger";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

export const GET = withLogging(async () => {
  try {
    const status = connectionManager.getStatus();
    return NextResponse.json(
      createApiResponse(status, "Connection status retrieved", 200),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get status";
    return NextResponse.json(
      createApiResponse(null, message, 500),
      { status: 500 },
    );
  }
}, "/api/connection/status");
