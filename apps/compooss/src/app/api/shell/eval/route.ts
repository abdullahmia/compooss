import { evaluateShellCommand } from "@/lib/core-modules/shell/shell.evaluator";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      command?: string;
      database?: string;
    };

    const command = body.command?.trim() ?? "";
    const database = body.database?.trim() || "test";

    if (!command) {
      return NextResponse.json(
        createApiResponse(null, "command is required.", 400),
        { status: 400 },
      );
    }

    const response = await evaluateShellCommand(command, { database });

    return NextResponse.json(
      createApiResponse(response, "OK", 200),
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      createApiResponse(null, message, 500),
      { status: 500 },
    );
  }
}
