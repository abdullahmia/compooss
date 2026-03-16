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

    const status = await connectionManager.connect(uri, options);
    return NextResponse.json(
      createApiResponse(status, "Connected successfully", 200),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Connection failed";
    return NextResponse.json(
      createApiResponse(null, message, 503),
      { status: 503 },
    );
  }
}
