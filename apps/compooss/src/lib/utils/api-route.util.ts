import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    const causedBy = msg.match(/caused by :: (.+)/);
    if (causedBy) return causedBy[1].trim();
    return msg;
  }
  return String(error);
}

export function protectedDbResponse() {
  return NextResponse.json(
    createApiResponse(
      null,
      "Access to system databases (admin, local, config) is not allowed.",
      403,
    ),
    { status: 403 },
  );
}
