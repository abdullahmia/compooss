import { connectionManager } from "@/lib/driver/connection-manager";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { uri, options } = await req.json();

    if (!uri || typeof uri !== "string") {
      return NextResponse.json(
        createApiResponse(null, "Connection URI is required", 400),
        { status: 400 },
      );
    }

    const result = await connectionManager.testConnection(uri, options);
    return NextResponse.json(
      createApiResponse(result, result.ok ? "Connection test passed" : result.message, result.ok ? 200 : 422),
      { status: result.ok ? 200 : 422 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Connection test failed";
    return NextResponse.json(
      createApiResponse(null, message, 500),
      { status: 500 },
    );
  }
}
