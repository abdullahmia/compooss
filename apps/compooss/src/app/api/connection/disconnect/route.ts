import { connectionManager } from "@/lib/driver/connection-manager";
import { withLogging } from "@/lib/logger";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

export const POST = withLogging(async () => {
  try {
    await connectionManager.disconnect();
    return NextResponse.json(
      createApiResponse({ connected: false }, "Disconnected successfully", 200),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Disconnect failed";
    return NextResponse.json(
      createApiResponse(null, message, 500),
      { status: 500 },
    );
  }
}, "/api/connection/disconnect");
